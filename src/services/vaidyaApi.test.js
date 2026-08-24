import test from 'node:test'
import assert from 'node:assert/strict'

import { sendChatMessage } from './vaidyaApi.js'

test('sendChatMessage returns answer and sources on successful API call', async () => {
  const originalFetch = globalThis.fetch
  
  // Mock fetch success
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://project--294401ed-f5ee-488d-8b5a-bb4c614b2ae9-dev.lovable.app/api/public/chat')
    assert.equal(options.method, 'POST')
    assert.equal(options.headers['Content-Type'], 'application/json')
    assert.deepEqual(JSON.parse(options.body), { message: 'What is Vata?' })
    
    return {
      ok: true,
      status: 200,
      json: async () => ({
        answer: 'Vata is air and space.',
        sources: [{ book: 'Ayurveda Essentials', page: 12 }]
      })
    }
  }

  try {
    const result = await sendChatMessage('What is Vata?')
    assert.deepEqual(result, {
      answer: 'Vata is air and space.',
      sources: [{ book: 'Ayurveda Essentials', page: 12 }]
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('sendChatMessage translates HTTP 429 to user friendly error', async () => {
  const originalFetch = globalThis.fetch
  
  // Mock HTTP 429
  globalThis.fetch = async () => ({
    ok: false,
    status: 429
  })

  try {
    await assert.rejects(
      sendChatMessage('What is Vata?'),
      /Too many requests. Please try again in a moment./
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('sendChatMessage translates HTTP 500 to user friendly error', async () => {
  const originalFetch = globalThis.fetch
  
  // Mock HTTP 500
  globalThis.fetch = async () => ({
    ok: false,
    status: 500
  })

  try {
    await assert.rejects(
      sendChatMessage('What is Vata?'),
      /The Ayurveda assistant is temporarily unavailable. Please try again./
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('sendChatMessage translates fetch failure to connection error', async () => {
  const originalFetch = globalThis.fetch
  
  // Mock network/connection failure
  globalThis.fetch = async () => {
    throw new Error('Connection refused')
  }

  try {
    await assert.rejects(
      sendChatMessage('What is Vata?'),
      /Unable to connect to the Ayurveda assistant. Please try again./
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})
