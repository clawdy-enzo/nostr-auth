#!/usr/bin/env node
/**
 * nostr-auth challenge.js
 * Generate a login challenge for Nostr signature-based auth
 * 
 * Usage: node challenge.js [--ttl-seconds 300]
 */

import crypto from 'crypto'

function main() {
  const args = process.argv.slice(2)
  
  // Parse TTL (default 5 minutes)
  let ttlSeconds = 300
  const ttlIndex = args.indexOf('--ttl-seconds')
  if (ttlIndex !== -1 && args[ttlIndex + 1]) {
    ttlSeconds = parseInt(args[ttlIndex + 1], 10)
  }

  const now = Math.floor(Date.now() / 1000)
  const expiresAt = now + ttlSeconds
  
  // Generate random challenge string
  const randomBytes = crypto.randomBytes(16).toString('hex')
  const challenge = `authenticate:${now}:${randomBytes}`

  const result = {
    challenge: challenge,
    created_at: now,
    expires_at: expiresAt,
    ttl_seconds: ttlSeconds,
    instructions: 'Sign this challenge string in the "content" field of a kind 1 Nostr event, then submit the signed event for verification.'
  }

  console.log(JSON.stringify(result, null, 2))
}

main()
