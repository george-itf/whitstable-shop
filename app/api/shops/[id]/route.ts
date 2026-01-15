import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET single shop by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('shops')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Shop GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT/PATCH - Update shop (owner or admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get the shop to check ownership
    const { data: shop, error: fetchError } = await supabase
      .from('shops')
      .select('owner_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    // Check if user is owner or admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.role === 'admin';
    const isOwner = shop.owner_id === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Not authorized to update this shop' }, { status: 403 });
    }

    // Parse body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Build update data - only allow certain fields
    const allowedOwnerFields = [
      'name', 'tagline', 'description', 'phone', 'email', 'website', 'instagram',
      'address_line1', 'address_line2', 'postcode', 'latitude', 'longitude', 'opening_hours'
    ];

    const allowedAdminFields = [
      ...allowedOwnerFields,
      'status', 'is_featured', 'category_id'
    ];

    const allowedFields = isAdmin ? allowedAdminFields : allowedOwnerFields;
    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // Validate specific fields
        if (field === 'status' && !['pending', 'approved', 'rejected'].includes(body[field] as string)) {
          return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
        }
        if (field === 'email' && body[field]) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(body[field] as string)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
          }
        }
        if (field === 'postcode' && body[field]) {
          const postcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;
          if (!postcodeRegex.test(body[field] as string)) {
            return NextResponse.json({ error: 'Invalid UK postcode format' }, { status: 400 });
          }
        }

        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('shops')
      .update(updateData)
      .eq('id', id)
      .select('*, category:categories(*)')
      .single();

    if (error) {
      console.error('Shop PUT error:', error);
      return NextResponse.json({ error: 'Failed to update shop' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Shop PUT exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Alias for PUT
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(request, { params });
}

// DELETE - Remove shop (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { error } = await supabase
      .from('shops')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Shop DELETE error:', error);
      return NextResponse.json({ error: 'Failed to delete shop' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Shop DELETE exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
