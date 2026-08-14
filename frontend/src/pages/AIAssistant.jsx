import { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { MedicalDoodleBackground } from '../components/ui/MedicalDoodles'
import { BotIcon, AlertTriangleIcon, ArrowRightIcon, SparklesIcon } from '../components/ui/Icons'
import api from '../utils/api'

function Message({ role, content }) {
  return (
    <div className={`flex gap-3 ${role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
          role === 'user'
            ? 'bg-[#0F766E] text-white shadow-sm font-semibold'
            : 'bg-[#EEF6F4] text-[#0F766E] border border-[#DCE8E5]'
        }`}
      >
        {role === 'user' ? '👤' : <BotIcon className="w-5 h-5" />}
      </div>
      <div
        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4.5 py-3 text-sm leading-relaxed ${
          role === 'user'
            ? 'bg-[#0F766E] text-white font-medium shadow-sm'
            : 'bg-[#F5F9F7] border border-[#DCE8E5] text-[#12302E] font-medium shadow-sm'
        }`}
      >
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
    <div className="min-h-screen bg-[#F5F9F7] text-[#12302E] flex flex-col relative overflow-hidden font-sans">
      {/* Background Medical Doodles */}
      <MedicalDoodleBackground density="normal" />

      <Navbar />

      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col">
        {/* Header */}
        <div className="mb-6 border-b border-[#DCE8E5] pb-6">
          <Badge variant="brand" size="md" icon={BotIcon} className="bg-white border-[#DCE8E5] mb-2.5">
            AI MEDICAL ASSISTANT
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12302E] tracking-tight">AI Medicine Assistant</h1>
          <p className="text-[#64748B] text-sm sm:text-base mt-1">
            Ask questions about medicines, interactions, and medical terms.
          </p>
        </div>

        {/* Safety Disclaimer Notice */}
        <div className="bg-amber-50/90 border border-amber-200 text-amber-900 rounded-2xl p-4 mb-6 shadow-sm flex items-start gap-3">
          <AlertTriangleIcon className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm leading-relaxed font-medium">
            <strong>Important Safety Notice:</strong> The AI assistant provides educational information only. It cannot prescribe medicines, diagnose conditions, or replace your doctor or pharmacist.
          </p>
        </div>

        {/* Chat Area Card */}
        <Card className="flex-1 bg-white border-[#DCE8E5] p-5 sm:p-6 overflow-y-auto mb-6 space-y-4 min-h-[420px] max-h-[520px] shadow-sm rounded-2xl">
          {messages.map((m, i) => (
            <Message key={i} role={m.role} content={m.content} />
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-[#EEF6F4] text-[#0F766E] border border-[#DCE8E5] flex items-center justify-center flex-shrink-0">
                <BotIcon className="w-5 h-5" />
              </div>
              <div className="bg-[#F5F9F7] border border-[#DCE8E5] rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <span className="w-2.5 h-2.5 bg-[#0F766E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2.5 h-2.5 bg-[#0F766E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2.5 h-2.5 bg-[#0F766E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </Card>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="mb-6">
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wide mb-2.5">Suggested Questions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3.5 py-2 bg-white hover:bg-[#EEF6F4] border border-[#DCE8E5] text-[#12302E] hover:text-[#0F766E] hover:border-[#0F766E]/40 font-semibold rounded-full transition-all cursor-pointer shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            id="ai-question-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a medicine, interaction, or medical term..."
            maxLength={500}
            disabled={loading}
            className="flex-1 px-4 py-3.5 bg-white border border-[#DCE8E5] text-[#12302E] rounded-xl text-sm placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all shadow-sm disabled:opacity-50"
          />
          <Button
            id="ai-send-btn"
            type="submit"
            disabled={loading || !input.trim()}
            loading={loading}
            variant="primary"
            size="md"
            icon={ArrowRightIcon}
            iconPosition="right"
            className="flex-shrink-0 font-bold"
          >
            Ask
          </Button>
        </form>

        <p className="text-xs text-[#94A3B8] text-center mt-3 font-medium">
          Powered by Gemini · Medical data from RxNorm & OpenFDA
        </p>
      </main>
    </div>
  )
}

export default AIAssistant
