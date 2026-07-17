import assert from "node:assert/strict";
import test from "node:test";
import { requestSession, sessionPayload } from "../src/session.mjs";

const config = { secretKey: "sk_test_fixture", baseUrl: "https://xpayr.com/api/v1", network: "bsc-testnet", currency: "USDC", amount: "9.99" };

test("creates canonical widget payload", () => {
  assert.equal(sessionPayload(config, "widget_1").network, "bsc-testnet");
  assert.equal(sessionPayload(config, "widget_1").metadata.integration, "crypto-checkout-widget-example");
});

test("returns only trusted hosted checkout sessions", async () => {
  const result = await requestSession(config, "widget_1", async (_url, options) => {
    assert.equal(options.headers.Authorization, "Bearer sk_test_fixture");
    return new Response(JSON.stringify({ id: "ps_test", payment_url: "https://xpayr.com/pay/ps_test", status: "pending" }), { status: 201 });
  });
  assert.equal(result.payment_url, "https://xpayr.com/pay/ps_test");
});

test("rejects foreign checkout origins", async () => {
  await assert.rejects(() => requestSession(config, "widget_1", async () => new Response(JSON.stringify({ id: "ps_test", payment_url: "https://example.com/pay/ps_test" }), { status: 201 })), /Untrusted/);
});
