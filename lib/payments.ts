/**
 * Payment stub. In production this is replaced by a Stripe Checkout Session
 * created on the server; the client never sees card details and never sees a
 * secret key. Nothing here touches a network.
 */

export type CheckoutIntent = {
  itemName: string;
  amountGBP: number;
  customerEmail: string;
  source: string;
  reason: string;
};

export type CheckoutResult =
  | { ok: true; reference: string }
  | { ok: false; message: string };

export async function createCheckout(
  intent: CheckoutIntent,
): Promise<CheckoutResult> {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  if (!intent.customerEmail.includes('@')) {
    return { ok: false, message: 'That email address does not look right.' };
  }

  // Deterministic reference so the demo never shows a different code on re-render.
  const seed = intent.itemName.length * 31 + intent.amountGBP;
  return { ok: true, reference: `SP-${2240 + (seed % 60)}` };
}
