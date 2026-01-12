import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIP, rateLimitResponse } from '@/lib/rate-limit';

// Validation schema for shop creation
const shopSchema = {
  required: ['name', 'address_line1', 'postcode'],
  optional: [
    'tagline',
    'description',
    'category_id',
    'phone',
    'email',
    'website',
    'instagram',
    'address_line2',
    'latitude',
    'longitude',
    'opening_hours',
  ],
};

function validateShopData(body: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  for (const field of shopSchema.required) {
    if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  }

  // Validate name length
  if (body.name && typeof body.name === 'string') {
    if (body.name.length < 2) errors.push('name must be at least 2 characters');
    if (body.name.length > 100) errors.push('name must be less than 100 characters');
  }

  // Validate postcode format (UK postcode)
  if (body.postcode && typeof body.postcode === 'string') {
    const postcodeRegex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;
    if (!postcodeRegex.test(body.postcode)) {
      errors.push('Invalid UK postcode format');
    }
  }

  // Validate email if provided
  if (body.email && typeof body.email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      errors.push('Invalid email format');
    }
  }

  // Validate website if provided
  if (body.website && typeof body.website === 'string') {
    try {
      new URL(body.website);
    } catch {
      errors.push('Invalid website URL');
    }
  }

  // Validate coordinates if provided
  if (body.latitude !== undefined) {
    const lat = Number(body.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push('latitude must be between -90 and 90');
    }
  }
  if (body.longitude !== undefined) {
    const lng = Number(body.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.push('longitude must be between -180 and 180');
    }
  }

  return { valid: errors.length === 0, errors };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') || '50';
    const featured = searchParams.get('featured');
    const status = searchParams.get('status'); // For admin queries
    const slug = searchParams.get('slug'); // For single shop lookup

    const supabase = await createClient();

    // Single shop lookup by slug
    if (slug) {
      const { data, error } = await supabase
        .from('shops')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .eq('status', 'approved')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }

    // List query
    let query = supabase
      .from('shops')
      .select('*, category:categories(*)')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    // Status filter (default to approved for public queries)
    if (status) {
      // Check if user is admin for non-approved status queries
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && status !== 'approved') {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role !== 'admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
      }
      query = query.eq('status', status);
    } else {
      query = query.eq('status', 'approved');
    }

    if (category) {
      // Support both category_id (UUID) and category slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category);
      if (isUUID) {
        query = query.eq('category_id', category);
      } else {
        // Lookup category by slug first
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', category)
          .single();

        if (categoryData) {
          query = query.eq('category_id', categoryData.id);
        }
      }
    }

    if (search) {
      // Sanitize search input to prevent injection
      const sanitizedSearch = search.replace(/[%_]/g, '\\$&');
      query = query.or(
        `name.ilike.%${sanitizedSearch}%,tagline.ilike.%${sanitizedSearch}%,description.ilike.%${sanitizedSearch}%`
      );
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Shops GET error:', error);
      return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Shops GET exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Rate limit: 5 shop submissions per hour per IP
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(`shops:post:${ip}`, { limit: 5, windowSeconds: 3600 });
    if (!rateLimit.success) {
      return rateLimitResponse(rateLimit.reset);
    }

    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Parse and validate body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = validateShopData(body);
    if (!validation.valid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
    }

    // Generate slug from name
    const slug =
      (body.name as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now().toString(36);

    // Build shop data with only allowed fields
    const shopData: Record<string, unknown> = {
      owner_id: user.id,
      status: 'pending',
      slug,
      name: (body.name as string).trim(),
      address_line1: (body.address_line1 as string).trim(),
      postcode: (body.postcode as string).trim().toUpperCase(),
    };

    // Add optional fields if provided
    for (const field of shopSchema.optional) {
      if (body[field] !== undefined && body[field] !== null && body[field] !== '') {
        if (typeof body[field] === 'string') {
          shopData[field] = (body[field] as string).trim();
        } else {
          shopData[field] = body[field];
        }
      }
    }

    const { data, error } = await supabase.from('shops').insert(shopData).select().single();

    if (error) {
      console.error('Shops POST error:', error);
      if (error.code === '23505') {
        return NextResponse.json({ error: 'A shop with this name already exists' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Failed to create shop' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Shops POST exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
