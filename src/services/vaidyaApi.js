/**
 * Vaidya Ayurveda Chatbot API Frontend Service
 * 
 * Directly queries the Vaidya RAG service from the browser context.
 * Bypasses the PrakritiAI backend as per architectural guidelines.
 */

const VAIDYA_API_URL = 'https://project--294401ed-f5ee-488d-8b5a-bb4c614b2ae9-dev.lovable.app/api/public/chat'

/**
 * Sends a message to the Vaidya Ayurveda Assistant API.
 * 
 * @param {string} message The query typed by the user.
 * @returns {Promise<{answer: string, sources: Array<{book: string, page: number}>}>}
 */
export async function sendChatMessage(message) {
  try {
    const response = await fetch(VAIDYA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    })

    if (response.status === 429) {
      throw new Error('Too many requests. Please try again in a moment.')
    }

    if (response.status === 500) {
      throw new Error('The Ayurveda assistant is temporarily unavailable. Please try again.')
    }

    if (!response.ok) {
      throw new Error('Unable to connect to the Ayurveda assistant. Please try again.')
    }

    const data = await response.json()
    return {
      answer: data.answer || '',
      sources: data.sources || []
    }
  } catch (error) {
    // If it's one of our predefined user-friendly errors, pass it along
    if (
      error.message === 'Too many requests. Please try again in a moment.' ||
      error.message === 'The Ayurveda assistant is temporarily unavailable. Please try again.'
    ) {
      throw error
    }

    // Otherwise, treat as a generic connection/network error to avoid leaking details
    throw new Error('Unable to connect to the Ayurveda assistant. Please try again.')
  }
}
