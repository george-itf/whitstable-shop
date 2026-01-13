import { z } from 'zod';

/**
 * Environment variable schema for runtime validation
 * Ensures all required environment variables are present and correctly formatted
 */

// Server-side environment variables (not exposed to client)
const serverEnvSchema = z.object({
  // Supabase service role key (for server-side operations)
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Client-side environment variables (exposed via NEXT_PUBLIC_ prefix)
const clientEnvSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL')
    .refine(
      (url) => url.includes('supabase.co') || url.includes('localhost'),
      'NEXT_PUBLIC_SUPABASE_URL must be a Supabase URL'
    ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),

  // Mapbox
  NEXT_PUBLIC_MAPBOX_TOKEN: z
    .string()
    .min(1, 'NEXT_PUBLIC_MAPBOX_TOKEN is required')
    .startsWith('pk.', 'NEXT_PUBLIC_MAPBOX_TOKEN must be a public key starting with pk.'),

  // Optional: Site URL for OAuth callbacks
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

// Combined schema for full validation
const envSchema = serverEnvSchema.merge(clientEnvSchema);

// Type definitions
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * Call this at app startup to catch configuration errors early
 */
export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((err) => `  - ${err.path.join('.')}: ${err.message}`)
      .join('\n');

    console.error('❌ Invalid environment variables:\n' + errors);

    // In development, throw to make issues obvious
    if (process.env.NODE_ENV === 'development') {
      throw new Error('Invalid environment variables. Check the console for details.');
    }

    // In production, log but don't crash (graceful degradation)
    // The app will fail at specific points where the env var is needed
  }

  return result.data as Env;
}

/**
 * Validated client environment variables
 * Safe to use in client components
 */
export const clientEnv = {
  get supabaseUrl() {
    return process.env.NEXT_PUBLIC_SUPABASE_URL!;
  },
  get supabaseAnonKey() {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  },
  get mapboxToken() {
    return process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
  },
  get siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL || 'https://whitstable.shop';
  },
};

/**
 * Validated server environment variables
 * Only use in server components, API routes, or server actions
 */
export const serverEnv = {
  get supabaseServiceKey() {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  },
  get nodeEnv() {
    return process.env.NODE_ENV || 'development';
  },
  get isDevelopment() {
    return process.env.NODE_ENV === 'development';
  },
  get isProduction() {
    return process.env.NODE_ENV === 'production';
  },
};

/**
 * Check if we're in a browser environment
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Check if we're on the server
 */
export const isServer = !isBrowser;
