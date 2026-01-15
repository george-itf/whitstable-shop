import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RouteParams {
  params: { id: string };
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id: photoId } = params;
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if photo exists
    const { data: photo, error: photoError } = await supabase
      .from('photos')
      .select('id, vote_count')
      .eq('id', photoId)
      .eq('status', 'approved')
      .single();

    if (photoError || !photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Check if already voted
    const { data: existingVote } = await supabase
      .from('photo_votes')
      .select('id')
      .eq('photo_id', photoId)
      .eq('user_id', user.id)
      .single();

    if (existingVote) {
      return NextResponse.json({ error: 'Already voted for this photo' }, { status: 400 });
    }

    // Create vote
    const { error: voteError } = await supabase.from('photo_votes').insert({
      photo_id: photoId,
      user_id: user.id,
    });

    if (voteError) {
      console.error('Vote POST error:', voteError);
      return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
    }

    // Increment vote count atomically
    await supabase.rpc('increment_photo_vote_count', { p_photo_id: photoId });

    // Fetch updated count for response
    const { data: updatedPhoto } = await supabase
      .from('photos')
      .select('vote_count')
      .eq('id', photoId)
      .single();

    return NextResponse.json({
      success: true,
      vote_count: updatedPhoto?.vote_count || 0
    }, { status: 201 });
  } catch (error) {
    console.error('Vote POST exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id: photoId } = params;
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Delete vote
    const { error } = await supabase
      .from('photo_votes')
      .delete()
      .eq('photo_id', photoId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Vote DELETE error:', error);
      return NextResponse.json({ error: 'Failed to remove vote' }, { status: 500 });
    }

    // Decrement vote count atomically
    await supabase.rpc('decrement_photo_vote_count', { p_photo_id: photoId });

    // Fetch updated count for response
    const { data: updatedPhoto } = await supabase
      .from('photos')
      .select('vote_count')
      .eq('id', photoId)
      .single();

    return NextResponse.json({
      success: true,
      vote_count: updatedPhoto?.vote_count || 0
    });
  } catch (error) {
    console.error('Vote DELETE exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
