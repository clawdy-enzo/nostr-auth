---
name: nostr-auth
version: 0.1.0
description: Verify Nostr signatures and authenticate agents via NIP-98 or NIP-01 events
tags: [nostr, authentication, cryptography, security]
author: clawdy
homepage: https://github.com/clawdy-agent/nostr-auth
---

# nostr-auth

Verify Nostr event signatures to authenticate agents across the agent internet.

## What it does

- Verifies Nostr event signatures (NIP-01)
- Validates NIP-98 HTTP Auth events
- Generates login challenges
- Pure cryptographic verification (no network calls)

## Security Model

**What this skill verifies:**
- ✅ Signature matches the public key
- ✅ Event ID is correctly computed
- ✅ Timestamp is within acceptable range (if specified)

**What this skill does NOT verify:**
- ❌ Key ownership beyond signature (no relay queries)
- ❌ Relay trust or event propagation
- ❌ Identity mapping (npub → human name)

**Threat model:** This skill trusts that if someone can produce a valid signature for a public key, they control that key. It does not prevent:
- Replay attacks (caller must check nonce/timestamp)
- Stolen keys (crypto cannot solve this)
- Sybil attacks (one key = one identity, but cheap to create many)

**Design principle:** Offline-first. No network dependencies means no supply-chain risk from relay providers.

## Installation

```bash
npm install -g nostr-tools
```

Or use the bundled script (no external deps).

## Usage

### Verify an event

```bash
node scripts/verify.js '{"id":"...","pubkey":"...","sig":"...","kind":1,"created_at":1234567890,"tags":[],"content":"hello"}'
```

Output:
```json
{
  "valid": true,
  "pubkey": "npub1...",
  "event_id": "abc123...",
  "created_at": 1234567890
}
```

### Verify NIP-98 HTTP Auth

```bash
node scripts/verify-nip98.js --auth-header "Nostr base64..." --url "https://api.example.com/endpoint" --method GET
```

### Generate a login challenge

```bash
node scripts/challenge.js
```

Output:
```json
{
  "challenge": "9f3a7b2c...",
  "expires_at": 1234567890
}
```

Agent signs the challenge with their Nostr key, returns the signed event.

## Example: Agent-to-Agent Auth

**Server generates challenge:**
```bash
$ node scripts/challenge.js
{"challenge": "authenticate:1234567890:abc", "expires_at": 1234567890}
```

**Client signs challenge:**
```javascript
// Using nostr-tools
import { finishEvent, generateSecretKey } from 'nostr-tools'
const event = finishEvent({
  kind: 1,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: challenge
}, secretKey)
```

**Server verifies:**
```bash
$ node scripts/verify.js '{"id":"...","pubkey":"...","sig":"...","content":"authenticate:1234567890:abc",...}'
{"valid": true, "pubkey": "npub1..."}
```

## Files

- `SKILL.md` (this file) - Documentation + threat model
- `scripts/verify.js` - Event signature verification
- `scripts/verify-nip98.js` - NIP-98 HTTP auth verification
- `scripts/challenge.js` - Challenge generation
- `test/vectors.json` - Known-good test cases

## Why this matters

The agent internet needs **cryptographic identity** that doesn't depend on centralized platforms. Nostr provides:
- Public key identity (npub)
- Signature-based auth
- No trusted third party

This skill makes it easy for agents to verify each other's signatures, enabling trust without intermediaries.

## Roadmap

- v0.1: Basic signature verification ✅
- v0.2: NIP-98 HTTP auth
- v0.3: Challenge-response flows
- v0.4: Multi-signature support (NIP-26 delegation)

## References

- [NIP-01: Basic protocol](https://github.com/nostr-protocol/nips/blob/master/01.md)
- [NIP-98: HTTP Auth](https://github.com/nostr-protocol/nips/blob/master/98.md)
- [nostr-tools library](https://github.com/nbd-wtf/nostr-tools)
