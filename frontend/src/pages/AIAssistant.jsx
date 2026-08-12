import { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../utils/api'

function Message({ role, content }) {
  return (
    <div className={`flex gap-3 ${role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
        role === 'user'
          ? 'bg-teal-600 text-white'
          : 'bg-slate-700 text-slate-300'
      }`}>
        {role === 'user' ? '👤' : '🤖'}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        role === 'user'
          ? 'bg-teal-600/30 border border-teal-700/50 text-slate-100'
          : 'bg-slate-800 border border-slate-700 text-slate-200'
      }`}>
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  )
}

const SUGGESTED_QUESTIONS = [
  'What is aspirin used for?',
  'Why do warfarin and aspirin interact?',
  'What side effects should I watch for with metformin?',
  'What questions should I ask my doctor about my medication?',
  'What does "QT prolongation" mean?',
  'What is the difference between generic and brand name medicine?',
]

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm MediSafe's AI assistant. I can help you understand medicines, drug interactions, and medical terms.

Please note: I can only provide educational information — I cannot prescribe medicines, diagnose conditions, or replace your doctor or pharmacist.

What would you like to know?`,
    },
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef             = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(question) {
    const text = (question || input).trim()
    if (!text) return

    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)

    try {
      const data = await api.post('/ai/ask', { question: text })
      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `I'm having trouble responding right now. For reliable medicine information, please consult your pharmacist or visit MedlinePlus (medlineplus.gov).\n\n⚠️ This is for educational purposes only.`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage()
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white">AI Medicine Assistant</h1>
          <p className="text-slate-400 text-sm mt-1">Ask questions about medicines, interactions, and medical terms.</p>
        </div>

        {/* Safety disclaimer */}
        <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs text-amber-300/80">
            ⚠️ <strong>Important:</strong> The AI assistant provides educational information only. It cannot prescribe medicines, diagnose conditions, or replace your doctor or pharmacist.
          </p>
        </div>

        {/* Chat messages */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-y-auto mb-4 space-y-4 min-h-[400px] max-h-[500px]">
          {messages.map((m, i) => (
            <Message key={i} role={m.role} content={m.content} />
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm">🤖</div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3">
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested questions */}
        {messages.length <= 1 && (
          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Suggested questions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            id="ai-question-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a medicine, interaction, or medical term..."
            maxLength={500}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all disabled:opacity-50"
          />
          <button
            id="ai-send-btn"
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm flex-shrink-0"
          >
            {loading ? '...' : 'Ask'}
          </button>
        </form>
        <p className="text-xs text-slate-600 text-center mt-2">
          Powered by Gemini · Medical data from RxNorm & OpenFDA
        </p>
      </main>
    </div>
  )
}

export default AIAssistant
