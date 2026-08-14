import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { PillIcon, SearchIcon, ShieldCheckIcon, BotIcon, CircleCheckIcon } from './ui/Icons'

const processSteps = [
  {
    step: '01',
    title: 'Add your medicines',
    description: 'Search generic or brand names with auto-complete, or scan a prescription image using OCR.',
    icon: PillIcon,
  },
  {
    step: '02',
    title: 'MediSafe checks interactions',
    description: 'Every drug pair in your list is automatically evaluated across NIH RxNorm interaction databases.',
    icon: SearchIcon,
  },
  {
    step: '03',
    title: 'Review verified results',
    description: 'Results are independently cross-checked against FDA FAERS adverse event co-reporting data.',
    icon: ShieldCheckIcon,
  },
  {
    step: '04',
    title: 'Understand what they mean',
    description: 'Read plain-language risk breakdowns or ask the AI assistant for simplified explanations.',
    icon: BotIcon,
  },
  {
    step: '05',
    title: 'Take the next step with confidence',
    description: 'Share findings with your physician or pharmacist to optimize your medication routine.',
    icon: CircleCheckIcon,
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-6 bg-[#F5F9F7] border-b border-[#DCE8E5]">
      <div className="max-w-7xl mx-auto space-y-12 text-center">

        <div className="max-w-2xl mx-auto space-y-3">
          <Badge variant="brand" size="sm">Step-by-Step Workflow</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#12302E]">
            How MediSafe Keeps You Safe
          </h2>
          <p className="text-base text-[#64748B] leading-relaxed">
            From search to clinical cross-verification in five seamless steps.
          </p>
        </div>

        {/* Connected Step Cards (Grid on desktop / vertical stack on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {processSteps.map((item, index) => {
            const IconComponent = item.icon
            return (
              <Card
                key={item.step}
                className="p-6 bg-white border-[#DCE8E5] flex flex-col justify-between text-left space-y-4 relative hover:border-[#0F766E]/40 transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#0F766E] bg-[#EEF6F4] px-2.5 py-1 rounded-md border border-[#0F766E]/10">
                      STEP {item.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#EEF6F4] text-[#0F766E] flex items-center justify-center">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-[#12302E] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-[#0F766E]/40 font-extrabold text-sm z-20">
                    →
                  </div>
                )}
              </Card>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default HowItWorks
