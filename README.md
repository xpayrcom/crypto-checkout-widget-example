<div align="center">
  <a href="https://xpayr.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://xpayr.com/public/images/xpayr-logo-white.png" />
      <source media="(prefers-color-scheme: light)" srcset="https://xpayr.com/public/images/xpayr-logo-black.png" />
      <img src="https://xpayr.com/public/images/xpayr-logo-white.png" alt="XPayr Official Logo" width="220" />
    </picture>
  </a>
  <p>
    <a href="https://xpayr.com"><img src="https://xpayr.com/partner-badge.php?type=powered_by&theme=dark" alt="Powered by XPayr" height="28" /></a>
    <a href="https://mcp.xpayr.com"><img src="https://img.shields.io/badge/MCP_Portal-mcp.xpayr.com-029bfd?style=for-the-badge" alt="XPayr MCP Portal" height="28" /></a>
    <a href="https://docs.xpayr.com"><img src="https://img.shields.io/badge/Docs-docs.xpayr.com-10b981?style=for-the-badge" alt="XPayr Docs" height="28" /></a>
    <a href="https://www.npmjs.com/package/@xpayr/mcp-server"><img src="https://img.shields.io/npm/v/@xpayr/mcp-server?style=for-the-badge&color=cb3837&label=MCP%20NPM" alt="NPM @xpayr/mcp-server" height="28" /></a>
  </p>
  <p>
    <a href="https://xpayr.com"><b>Official Website</b></a> •
    <a href="https://mcp.xpayr.com"><b>AI &amp; MCP Portal (21 Tools)</b></a> •
    <a href="https://docs.xpayr.com"><b>Developer Docs</b></a> •
    <a href="https://xpayr.com/developers"><b>Developer Hub</b></a> •
    <a href="https://xpayr.com/tools/crypto-payment-fee-calculator"><b>0.5% Fee Calculator</b></a>
  </p>
</div>

---

# XPayr Crypto Checkout Widget Example

[![CI](https://github.com/xpayrcom/crypto-checkout-widget-example/actions/workflows/ci.yml/badge.svg)](https://github.com/xpayrcom/crypto-checkout-widget-example/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-0f766e.svg)](LICENSE)

Interactive XPayr checkout widget example with secure server-side session creation and popup, redirect, and embedded checkout modes.

> **Status:** Runnable browser integration example

## Purpose

Demonstrate a polished browser checkout without exposing merchant secret keys or inventing payment status client-side.

## Included

- Popup, redirect, and embedded checkout modes
- Server-side session creation
- Strict checkout-origin event handling

## Requirements

- Node.js 18+
- npm 9+

## Quick start

```bash
cp .env.example .env
npm test
npm start
```

Open `http://127.0.0.1:3001` and switch between popup, embedded, and redirect modes. Every mode uses the same server-created XPayr session.

## Trust model

- The merchant secret key is read only by the Node.js server.
- Checkout URLs must use the exact `https://xpayr.com/pay/` origin and path.
- Embedded messages are accepted only from `https://xpayr.com` and remain UX signals.
- Order fulfillment waits for a verified webhook or authenticated API reconciliation.

The repository intentionally avoids pretending that closing a popup, receiving a browser message, or returning to a success URL proves payment.

Use an XPayr test key before live credentials. Never expose `sk_test_*`, `sk_live_*`, agent keys, webhook secrets, or wallet private keys in browser code or commits.

## Documentation

- [Developer Hub](https://xpayr.com/developers)
- [Merchant API documentation](https://xpayr.com/doc-api)
- [Testnet checkout guide](https://xpayr.com/developers/testnet-checkout-api)
- [Webhook signature guide](https://xpayr.com/developers/webhook-signature-guide)

## Security

Read [SECURITY.md](SECURITY.md) before reporting a vulnerability. Payment completion must be based on verified XPayr webhook/API state and canonical on-chain evidence, not browser callbacks alone.

## License

MIT. See [LICENSE](LICENSE).
