'use server';

/**
 * Server Functions for the public site.
 *
 * In this demonstration build nothing is persisted — an enquiry is validated
 * and acknowledged, then discarded. When a database and a mail provider are
 * added, this is the one file that needs to change.
 *
 * Note for production: Server Functions are reachable by direct POST, not only
 * through the form. Anything that reads or writes real data must check
 * authorisation inside the function itself.
 */

export type EnquiryState = {
  status: 'idle' | 'error' | 'sent';
  message: string;
  fieldErrors?: Record<string, string>;
};

export async function submitEnquiry(
  _previousState: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const subject = String(formData.get('subject') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = 'Please give me a name to reply to.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = 'That email address does not look right.';
  }
  if (message.length < 10) {
    fieldErrors.message = 'A sentence or two more would help me answer properly.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: 'error',
      message: 'Almost — a couple of things need fixing.',
      fieldErrors,
    };
  }

  // Stands in for sending mail and writing the enquiry to the database.
  await new Promise((resolve) => setTimeout(resolve, 900));

  return {
    status: 'sent',
    message: `Thank you, ${name.split(' ')[0]}. I read everything myself and usually reply within two working days${subject ? ` — I have noted this is about ${subject.toLowerCase()}` : ''}.`,
  };
}
