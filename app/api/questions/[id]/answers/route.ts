import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

interface RouteParams {
  params: { id: string };
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    // Rate limit: 20 answers per hour per IP
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(`answers:post:${ip}`, { limit: 20, windowSeconds: 3600 });
    if (!rateLimit.success) {
      return rateLimitResponse(rateLimit.reset);
    }

    const { id: questionId } = params;
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { answer } = body;

    if (!answer || (typeof answer === 'string' && answer.trim().length < 20)) {
      return NextResponse.json({ error: 'Answer must be at least 20 characters' }, { status: 400 });
    }

    if ((answer as string).length > 2000) {
      return NextResponse.json({ error: 'Answer must be less than 2000 characters' }, { status: 400 });
    }

    // Verify question exists
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('id, status')
      .eq('id', questionId)
      .single();

    if (questionError || !question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    if (question.status === 'closed') {
      return NextResponse.json({ error: 'This question is closed' }, { status: 400 });
    }

    const answerData = {
      question_id: questionId,
      user_id: user.id,
      answer: (answer as string).trim(),
      upvotes: 0,
      is_accepted: false,
    };

    const { data, error } = await supabase.from('answers').insert(answerData).select().single();

    if (error) {
      console.error('Answer POST error:', error);
      return NextResponse.json({ error: 'Failed to submit answer' }, { status: 500 });
    }

    // Update answer count and status
    await supabase
      .from('questions')
      .update({
        answer_count: (await supabase.from('answers').select('id', { count: 'exact' }).eq('question_id', questionId)).count || 1,
        status: 'answered',
      })
      .eq('id', questionId)
      .catch(() => {});

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Answer POST exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Accept an answer (question author only)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id: questionId } = params;
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { answer_id } = body;

    if (!answer_id) {
      return NextResponse.json({ error: 'answer_id is required' }, { status: 400 });
    }

    // Verify question ownership
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('id, user_id')
      .eq('id', questionId)
      .single();

    if (questionError || !question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    if (question.user_id !== user.id) {
      return NextResponse.json({ error: 'Only the question author can accept answers' }, { status: 403 });
    }

    // Clear any previously accepted answer
    await supabase.from('answers').update({ is_accepted: false }).eq('question_id', questionId);

    // Accept the new answer
    const { error } = await supabase.from('answers').update({ is_accepted: true }).eq('id', answer_id).eq('question_id', questionId);

    if (error) {
      console.error('Answer PUT error:', error);
      return NextResponse.json({ error: 'Failed to accept answer' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Answer PUT exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
