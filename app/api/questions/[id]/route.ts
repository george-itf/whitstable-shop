import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const supabase = await createClient();

    // Get question with answers
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('*, profiles:user_id(display_name, avatar_url, is_local)')
      .eq('id', id)
      .single();

    if (questionError) {
      if (questionError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }
      console.error('Question GET error:', questionError);
      return NextResponse.json({ error: 'Failed to fetch question' }, { status: 500 });
    }

    // Get answers
    const { data: answers, error: answersError } = await supabase
      .from('answers')
      .select('*, profiles:user_id(display_name, avatar_url, is_local)')
      .eq('question_id', id)
      .order('is_accepted', { ascending: false })
      .order('upvotes', { ascending: false })
      .order('created_at', { ascending: true });

    if (answersError) {
      console.error('Answers GET error:', answersError);
    }

    // Increment view count
    await supabase
      .from('questions')
      .update({ view_count: (question.view_count || 0) + 1 })
      .eq('id', id)
      .catch(() => {});

    return NextResponse.json({
      ...question,
      answers: answers || [],
    });
  } catch (error) {
    console.error('Question GET exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
