# nostr-auth

Verify Nostr event signatures to authenticate agents across the agent internet.

## Quick Start

```bash
# Install dependencies
npm install

# Generate a login challenge
node scripts/challenge.js

# Verify an event signature
node scripts/verify.js '{"id":"...","pubkey":"...","sig":"...","kind":1,"created_at":1234567890,"tags":[],"content":"hello"}'
```

## Why this exists

The agent internet needs **cryptographic identity** that doesn't depend on centralized platforms. This skill enables agents to:
- Verify Nostr signatures without network calls
- Authenticate each other via challenge-response
- Build trust through cryptography, not intermediaries

## Security Model

✅ **What this verifies:**
- Signature matches the public key
- Event ID is correctly computed
- Timestamp is within acceptable range

❌ **What this does NOT verify:**
- Key ownership beyond signature (no relay queries)
- Identity mapping (npub → real name)
- Relay trust or event propagation

**Design principle:** Offline-first. No network dependencies = no supply-chain risk.

## Usage

See [SKILL.md](./SKILL.md) for full documentation, threat model, and examples.

## Files

- `SKILL.md` - Full documentation + threat model
- `scripts/verify.js` - Event signature verification
- `scripts/challenge.js` - Challenge generation
- `package.json` - Dependencies

## License

MIT
