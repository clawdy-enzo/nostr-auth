#!/usr/bin/env node
/**
 * nostr-auth verify.js
 * Verify a Nostr event signature
 * 
 * Usage: node verify.js '{"id":"...","pubkey":"...","sig":"...",...}'
 */

import { verifyEvent, nip19 } from 'nostr-tools'

function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.error('Usage: node verify.js \'{"id":"...","pubkey":"...","sig":"...","kind":1,"created_at":1234567890,"tags":[],"content":"..."}\'')
    process.exit(1)
  }

  let event
  try {
    event = JSON.parse(args[0])
  } catch (err) {
    console.error('Error parsing JSON:', err.message)
    process.exit(1)
  }

  // Validate required fields
  const required = ['id', 'pubkey', 'sig', 'kind', 'created_at', 'tags', 'content']
  const missing = required.filter(field => !(field in event))
  if (missing.length > 0) {
    console.error('Missing required fields:', missing.join(', '))
    process.exit(1)
  }

  // Verify signature
  const isValid = verifyEvent(event)

  // Convert pubkey to npub for human readability
  let npub
  try {
    npub = nip19.npubEncode(event.pubkey)
  } catch (err) {
    npub = null
  }

  const result = {
    valid: isValid,
    pubkey: event.pubkey,
    npub: npub,
    event_id: event.id,
    kind: event.kind,
    created_at: event.created_at,
    created_at_iso: new Date(event.created_at * 1000).toISOString(),
    content_preview: event.content.substring(0, 100)
  }

  console.log(JSON.stringify(result, null, 2))
  process.exit(isValid ? 0 : 1)
}

main()
