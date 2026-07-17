export function sessionPayload(config, orderId) {
  if (!/^\d+(?:\.\d{1,8})?$/.test(config.amount) || Number(config.amount) <= 0) throw new TypeError("Invalid DEMO_AMOUNT");
  if (!/^[A-Z0-9_-]{2,16}$/.test(config.currency)) throw new TypeError("Invalid XPAYR_CURRENCY");
  if (!/^[a-z0-9-]{2,64}$/.test(config.network)) throw new TypeError("Invalid XPAYR_NETWORK");
  return { amount: config.amount, currency: config.currency, network: config.network, order_id: orderId, description: "Checkout widget demo", metadata: { integration: "crypto-checkout-widget-example" } };
}

export async function requestSession(config, orderId, fetchImpl = globalThis.fetch) {
  if (!config.secretKey) throw new Error("XPAYR_SECRET_KEY is required");
  const response = await fetchImpl(`${config.baseUrl}/payments`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${config.secretKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(sessionPayload(config, orderId)),
    signal: AbortSignal.timeout(20_000),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error?.message || `XPayr returned ${response.status}`);
  const paymentUrl = String(body.payment_url || "");
  if (!/^https:\/\/xpayr\.com\/pay\//.test(paymentUrl)) throw new Error("Untrusted payment URL returned");
  return { payment_id: body.id, payment_url: paymentUrl, status: body.status };
}
