import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      // If no profile exists, create one
      if (error.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            display_name: user.email?.split('@')[0] || 'User',
          })
          .select()
          .single();

        if (createError) {
          console.error('Profile create error:', createError);
          return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
        }

        return NextResponse.json(newProfile);
      }

      console.error('Profile GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile GET exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
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

    // Allowed fields to update
    const allowedFields = ['display_name', 'avatar_url', 'bio', 'postcode'];
    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (typeof body[field] === 'string') {
          updateData[field] = (body[field] as string).trim() || null;
        } else {
          updateData[field] = body[field];
        }
      }
    }

    // Validate display_name if provided
    if (updateData.display_name !== undefined) {
      const name = updateData.display_name as string;
      if (name && (name.length < 2 || name.length > 50)) {
        return NextResponse.json({ error: 'display_name must be 2-50 characters' }, { status: 400 });
      }
    }

    // Validate postcode if provided
    if (updateData.postcode) {
      const postcode = updateData.postcode as string;
      const postcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;
      if (!postcodeRegex.test(postcode)) {
        return NextResponse.json({ error: 'Invalid UK postcode format' }, { status: 400 });
      }
      updateData.postcode = postcode.toUpperCase();

      // Check if local (CT5 postcode)
      updateData.is_local = postcode.toUpperCase().startsWith('CT5');
    }

    // Validate avatar_url if provided
    if (updateData.avatar_url) {
      try {
        new URL(updateData.avatar_url as string);
      } catch {
        return NextResponse.json({ error: 'Invalid avatar URL' }, { status: 400 });
      }
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Profile PUT error:', error);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile PUT exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
