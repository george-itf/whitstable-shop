import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'open'; // open, answered, closed
    const sort = searchParams.get('sort') || 'recent'; // recent, popular, unanswered
    const limit = parseInt(searchParams.get('limit') || '20');

    const supabase = await createClient();

    let query = supabase
      .from('questions')
      .select('*, profiles:user_id(display_name, avatar_url, is_local)')
      .limit(limit);

    // Status filter
    if (status === 'unanswered') {
      query = query.eq('status', 'open').eq('answer_count', 0);
    } else if (status !== 'all') {
      query = query.eq('status', status);
    }

    // Sorting
    switch (sort) {
      case 'popular':
        query = query.order('view_count', { ascending: false });
        break;
      case 'unanswered':
        query = query.eq('answer_count', 0).order('created_at', { ascending: false });
        break;
      case 'recent':
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Questions GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Questions GET exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Rate limit: 10 questions per hour per IP
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(`questions:post:${ip}`, { limit: 10, windowSeconds: 3600 });
    if (!rateLimit.success) {
      return rateLimitResponse(rateLimit.reset);
    }

    const supabase = await createClient();

    // Get user (optional - can post anonymously)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { question, context } = body;

    if (!question || (typeof question === 'string' && question.trim().length < 10)) {
      return NextResponse.json({ error: 'Question must be at least 10 characters' }, { status: 400 });
    }

    if ((question as string).length > 500) {
      return NextResponse.json({ error: 'Question must be less than 500 characters' }, { status: 400 });
    }

    const questionData = {
      user_id: user?.id || null,
      question: (question as string).trim(),
      context: context ? (context as string).trim() : null,
      status: 'open',
      answer_count: 0,
      view_count: 0,
    };

    const { data, error } = await supabase.from('questions').insert(questionData).select().single();

    if (error) {
      console.error('Questions POST error:', error);
      return NextResponse.json({ error: 'Failed to submit question' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Questions POST exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
