/**
 * Email Service
 *
 * Abstraction layer for sending emails.
 * Currently supports: Resend (recommended), console logging (dev)
 *
 * To use Resend:
 * 1. npm install resend
 * 2. Set RESEND_API_KEY in .env
 * 3. Verify your domain in Resend dashboard
 */

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Default sender
const DEFAULT_FROM = 'Whitstable.shop <hello@whitstable.shop>';

/**
 * Send an email using the configured provider
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const { to, subject, html, text, from = DEFAULT_FROM, replyTo } = options;

  // Check if Resend is configured
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey && resendApiKey !== 'your_resend_api_key') {
    return sendWithResend({ to, subject, html, text, from, replyTo }, resendApiKey);
  }

  // Fallback to console logging in development
  console.log('📧 Email would be sent (no RESEND_API_KEY configured):');
  console.log(`   To: ${Array.isArray(to) ? to.join(', ') : to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   From: ${from}`);
  if (text) console.log(`   Preview: ${text.substring(0, 100)}...`);

  return {
    success: true,
    messageId: `dev-${Date.now()}`,
  };
}

/**
 * Send email via Resend API
 */
async function sendWithResend(
  options: EmailOptions,
  apiKey: string
): Promise<EmailResult> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: options.from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }

    const data = await response.json();
    return {
      success: true,
      messageId: data.id,
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send a batch of emails (for digests, announcements)
 */
export async function sendBatchEmails(
  emails: EmailOptions[]
): Promise<{ sent: number; failed: number; results: EmailResult[] }> {
  const results: EmailResult[] = [];
  let sent = 0;
  let failed = 0;

  // Process in batches of 10 to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(sendEmail));

    for (const result of batchResults) {
      results.push(result);
      if (result.success) {
        sent++;
      } else {
        failed++;
      }
    }

    // Small delay between batches
    if (i + batchSize < emails.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return { sent, failed, results };
}
