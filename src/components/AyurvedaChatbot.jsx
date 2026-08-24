import { useState, useEffect, useRef } from 'react'
import { X, Send, BookOpen, Sparkles, Trash2, AlertCircle } from 'lucide-react'
import { sendChatMessage } from '../services/vaidyaApi.js'

// Simple inline markdown parsing to style bold text
function parseInlineMarkdown(text) {
  if (!text) return ''
  // Split by bold patterns (**text**)
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-pa-green-2 font-sans">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

// Custom parser to format bullet points, subheadings, and paragraphs returned by the API
function FormattedText({ text }) {
  if (!text) return null

  const lines = text.split('\n')

  return (
    <div className="space-y-1.5 font-sans text-sm leading-relaxed text-[#3b463d]">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />
        }

        // Heading level 3
        if (trimmed.startsWith('###')) {
          const content = trimmed.replace(/^###\s*/, '')
          return (
            <h4 key={idx} className="font-serif text-[13px] font-bold text-pa-green-2 mt-3 mb-1 uppercase tracking-wide">
              {parseInlineMarkdown(content)}
            </h4>
          )
        }

        // Heading level 2
        if (trimmed.startsWith('##')) {
          const content = trimmed.replace(/^##\s*/, '')
          return (
            <h3 key={idx} className="font-serif text-sm font-bold text-pa-green-2 mt-4 mb-2">
              {parseInlineMarkdown(content)}
            </h3>
          )
        }

        // List item formatting
        if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
          const content = trimmed.replace(/^[\*\-]\s*/, '')
          return (
            <li key={idx} className="ml-4 list-disc pl-1 text-[#4b564d] my-1">
              {parseInlineMarkdown(content)}
            </li>
          )
        }

        // Default paragraph line
        return (
          <p key={idx} className="text-[#3b463d]">
            {parseInlineMarkdown(line)}
          </p>
        )
      })}
    </div>
  )
}

export default function AyurvedaChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  
  // Transition states for animation
  const [isRendered, setIsRendered] = useState(false)
  const [backdropVisible, setBackdropVisible] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('prakriti_chat_messages')
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (e) {
        console.error('Failed to parse saved chat messages', e)
      }
    } else {
      // Default welcome message
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: 'Namaste! I am your Vaidya Ayurveda Assistant. Ask me anything about Vata, Pitta, Kapha, seasonal routines, or daily wellness guidelines.',
          timestamp: Date.now()
        }
      ])
    }
  }, [])

  // Save chat history to localStorage on updates
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('prakriti_chat_messages', JSON.stringify(messages))
    }
  }, [messages])

  // Slide-in animation trigger
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden' // Lock background scrolling
      const timer1 = setTimeout(() => setBackdropVisible(true), 10)
      const timer2 = setTimeout(() => setIsRendered(true), 50)
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    } else {
      document.body.style.overflow = 'unset'
      setIsRendered(false)
      setBackdropVisible(false)
    }
  }, [isOpen])

  // Scroll to bottom when messages list updates or typing status changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  // Focus input when open
  useEffect(() => {
    if (isRendered && inputRef.current && !isSending) {
      inputRef.current.focus()
    }
  }, [isRendered, isSending])

  const handleSend = async (e) => {
    if (e) e.preventDefault()
    
    const query = messageInput.trim()
    if (!query || isSending) return

    setErrorMessage(null)
    setIsSending(true)
    
    // Clear the input field immediately
    setMessageInput('')

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now()
    }

    setMessages((prev) => [...prev, userMessage])

    try {
      const response = await sendChatMessage(query)
      
      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.answer,
        sources: response.sources || [],
        timestamp: Date.now()
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      // Display the user-friendly error in the chat panel
      setErrorMessage(err.message)
      
      // Restore input text so the user doesn't lose what they wrote
      setMessageInput(query)
    } finally {
      setIsSending(false)
    }
  }

  const clearHistory = () => {
    const defaultWelcome = [
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Namaste! I am your Vaidya Ayurveda Assistant. Ask me anything about Vata, Pitta, Kapha, seasonal routines, or daily wellness guidelines.',
        timestamp: Date.now()
      }
    ]
    setMessages(defaultWelcome)
    localStorage.setItem('prakriti_chat_messages', JSON.stringify(defaultWelcome))
    setErrorMessage(null)
  }

  // Deduplicate sources by book and page number to keep listings clean
  const getUniqueSources = (sources) => {
    if (!sources || !Array.isArray(sources)) return []
    const unique = []
    const seen = new Set()
    sources.forEach((src) => {
      const key = `${src.book || ''}-${src.page || ''}`
      if (src.book && !seen.has(key)) {
        seen.add(key)
        unique.push(src)
      }
    })
    return unique
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px] transition-opacity duration-300 ${
          backdropVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-out Drawer Panel */}
      <aside
        className={`fixed inset-y-0 right-0 z-[60] flex w-full max-w-[100vw] sm:max-w-[460px] md:max-w-[500px] flex-col border-l border-black/5 bg-[#fafbf7] shadow-[0_-8px_36px_rgba(27,67,50,0.12)] transition-transform duration-300 ease-out ${
          isRendered ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 bg-white px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef4e4] text-pa-green-2">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="font-serif text-[1.05rem] font-bold text-pa-green-2 leading-tight">Ayurveda Assistant</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-sans text-[10px] font-semibold text-[#6a7a6a] uppercase tracking-wider">Vaidya RAG Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {messages.length > 1 && (
              <button
                type="button"
                onClick={clearHistory}
                className="rounded-full p-2 text-[#7f8f7f] hover:bg-[#f4f6ea] hover:text-[#d32f2f] transition cursor-pointer"
                title="Clear Chat History"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-[#7f8f7f] hover:bg-[#f4f6ea] hover:text-pa-green-2 transition cursor-pointer"
              aria-label="Close Chat"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 bg-gradient-to-b from-[#fafbf7] to-[#f4f6ef]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user'
            const uniqueSources = isUser ? [] : getUniqueSources(msg.sources)

            return (
              <div key={msg.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`relative flex flex-col shadow-sm max-w-[88%] rounded-2xl p-4 font-sans text-sm ${
                    isUser
                      ? 'bg-pa-green-2 text-white rounded-tr-none'
                      : 'bg-white border border-[#e7ebdc] text-[#2c332c] rounded-tl-none'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed font-sans">{msg.text}</p>
                  ) : (
                    <>
                      <FormattedText text={msg.text} />
                      
                      {uniqueSources.length > 0 && (
                        <div className="mt-3.5 pt-2.5 border-t border-black/[0.04] text-[11px] text-[#637363]">
                          <span className="font-semibold text-pa-green-2 flex items-center gap-1 mb-1.5">
                            <BookOpen className="h-3 w-3" />
                            Sources:
                          </span>
                          <ul className="space-y-1">
                            {uniqueSources.map((src, sIdx) => (
                              <li key={sIdx} className="list-none pl-0 flex items-start gap-1">
                                <span className="text-[#a4b4a4] shrink-0 mt-0.5">•</span>
                                <span>{src.book} — Page {src.page}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}

          {/* Typing Indicator */}
          {isSending && (
            <div className="flex w-full justify-start">
              <div className="bg-white border border-[#e7ebdc] shadow-sm rounded-2xl rounded-tl-none px-4 py-3.5 max-w-[88%] flex items-center gap-2 text-xs text-[#6f7f6f]">
                <div className="flex space-x-1 items-center mr-1">
                  <div className="h-1.5 w-1.5 bg-pa-green-2 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-1.5 w-1.5 bg-pa-green-2 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-1.5 w-1.5 bg-pa-green-2 rounded-full animate-bounce" />
                </div>
                <span className="italic font-medium">Vaidya AI is thinking...</span>
              </div>
            </div>
          )}

          {/* Error Message Block */}
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50/70 p-3.5 text-xs text-red-800 flex items-start gap-2.5 shadow-sm">
              <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Consultation Error</p>
                <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => handleSend()}
                  className="mt-2 text-[10px] font-bold uppercase tracking-wider text-pa-green-deep hover:underline focus:outline-none"
                >
                  Retry request
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="border-t border-black/5 bg-white p-4">
          <div className="relative flex items-center bg-[#f4f6ea] rounded-xl border border-[#e7ebdc] px-3.5 py-1.5 focus-within:border-pa-green-2/30 focus-within:ring-1 focus-within:ring-pa-green-2/15 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              disabled={isSending}
              placeholder={isSending ? "Please wait..." : "Ask about Vata, Pitta, Kapha..."}
              className="flex-1 bg-transparent text-sm text-[#2a2a2a] outline-none border-none py-1.5 placeholder:text-[#a0aaa0] disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isSending || !messageInput.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-pa-green-2 text-white shadow transition hover:opacity-90 disabled:bg-[#d6dbce] disabled:text-[#a8af9f] disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </aside>
    </>
  )
}
