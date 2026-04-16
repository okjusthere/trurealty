'use client'

import { useState, type FormEvent } from 'react'
import {
  Home,
  BarChart3,
  FileText,
  TrendingUp,
  Target,
  Shield,
  Users,
  Loader2,
  Send,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const timeframeOptions = [
  { value: '', label: 'Select a timeframe' },
  { value: 'just-curious', label: 'Just Curious' },
  { value: '1-3-months', label: '1-3 Months' },
  { value: '3-6-months', label: '3-6 Months' },
  { value: '6-12-months', label: '6-12 Months' },
  { value: 'not-sure', label: 'Not Sure' },
]

const propertyTypeOptions = [
  { value: '', label: 'Select property type' },
  { value: 'single-family', label: 'Single Family Home' },
  { value: 'condo', label: 'Condo / Co-op' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'multi-family', label: 'Multi-Family' },
  { value: 'other', label: 'Other' },
]

const inputStyles =
  'w-full px-4 py-2.5 text-sm border border-border rounded-md bg-white text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'

const steps = [
  {
    icon: Home,
    title: 'Enter Your Address',
    description: 'Tell us about your property so we can begin the analysis.',
  },
  {
    icon: BarChart3,
    title: 'We Analyze the Market',
    description: 'Our agents research comparable sales and current market trends.',
  },
  {
    icon: FileText,
    title: 'Get Your Free Report',
    description: 'Receive a personalized Comparative Market Analysis delivered to you.',
  },
]

const benefits = [
  {
    icon: Target,
    title: 'Accurate Pricing',
    description:
      'Know exactly what your home is worth based on recent comparable sales in your neighborhood.',
  },
  {
    icon: TrendingUp,
    title: 'Market Trends',
    description:
      'Understand how the local market is performing and where prices are headed.',
  },
  {
    icon: Shield,
    title: 'Competitive Edge',
    description:
      'Price your home strategically to attract qualified buyers and maximize your return.',
  },
  {
    icon: Users,
    title: 'Expert Guidance',
    description:
      'Get professional advice from experienced agents who know your local market inside and out.',
  },
]

export default function HomeValuePage() {
  const [address, setAddress] = useState('')
  const [step, setStep] = useState<'input' | 'form' | 'success'>('input')
  const [loading, setLoading] = useState(false)

  function handleAddressSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!address.trim()) return
    setStep('form')
  }

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    // TODO: Connect to Kevv CRM
    console.log('Home value lead submission:', data)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    setLoading(false)
    setStep('success')
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary-light py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent_70%)]" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            What&apos;s Your Home Worth?
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Get a free, no-obligation market analysis of your property
          </p>
        </div>
      </section>

      {/* Address Input / Form Section */}
      <section className="py-16 bg-muted-bg">
        <div className="max-w-2xl mx-auto px-4">
          {step === 'input' && (
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
              <h2 className="font-heading text-2xl text-primary text-center mb-2">
                Start Your Free Home Valuation
              </h2>
              <p className="text-muted text-center mb-8 text-sm">
                Enter your property address to get started
              </p>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your property address..."
                  required
                  className={cn(inputStyles, 'py-4 text-base')}
                />
                <button
                  type="submit"
                  className="w-full py-4 text-base font-semibold text-white bg-accent rounded-md hover:bg-accent/90 transition-colors"
                >
                  Get My Home Value
                </button>
              </form>
            </div>
          )}

          {step === 'form' && (
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-700 font-medium">
                  Address received
                </span>
              </div>
              <h2 className="font-heading text-2xl text-primary mb-1">
                Almost There!
              </h2>
              <p className="text-muted text-sm mb-6">
                Tell us a bit more so we can prepare your personalized market analysis.
              </p>
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="hv-name"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="hv-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your full name"
                      className={inputStyles}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="hv-email"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="hv-email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className={inputStyles}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="hv-phone"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="hv-phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="(555) 123-4567"
                      className={inputStyles}
                    />
                  </div>

                  {/* Property Type */}
                  <div>
                    <label
                      htmlFor="hv-property-type"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Property Type
                    </label>
                    <select
                      id="hv-property-type"
                      name="propertyType"
                      className={cn(
                        inputStyles,
                        'appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat',
                      )}
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                      }}
                    >
                      {propertyTypeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Property Address (pre-filled) */}
                <div>
                  <label
                    htmlFor="hv-address"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Property Address
                  </label>
                  <input
                    id="hv-address"
                    name="address"
                    type="text"
                    defaultValue={address}
                    className={inputStyles}
                  />
                </div>

                {/* Timeframe */}
                <div>
                  <label
                    htmlFor="hv-timeframe"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Timeframe to Sell
                  </label>
                  <select
                    id="hv-timeframe"
                    name="timeframe"
                    className={cn(
                      inputStyles,
                      'appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat',
                    )}
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                    }}
                  >
                    {timeframeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 text-sm font-semibold text-white bg-accent rounded-md hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Get My Free Market Analysis
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-7 w-7 text-green-600" />
              </div>
              <h2 className="font-heading text-2xl text-primary mb-2">
                Thank You!
              </h2>
              <p className="text-muted max-w-md mx-auto">
                One of our experienced agents will contact you within 24 hours with
                your personalized market analysis.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-heading text-primary mb-2 text-center">
            How It Works
          </h2>
          <p className="text-muted text-center mb-12">
            Getting your free home valuation is easy
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, i) => (
              <div key={item.title} className="text-center">
                <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <item.icon className="h-7 w-7 text-primary" />
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Get a CMA */}
      <section className="py-16 bg-muted-bg">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-heading text-primary mb-2 text-center">
            Why Get a CMA?
          </h2>
          <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
            Thinking about selling? A Comparative Market Analysis (CMA) gives you
            the data and insights you need to make informed decisions about your
            property.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <benefit.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading mb-4">
            Ready to Find Out What Your Home Is Worth?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Our experienced agents are ready to provide you with a free,
            no-obligation Comparative Market Analysis.
          </p>
          <button
            onClick={() => {
              setStep('input')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="inline-block bg-accent text-white px-10 py-4 text-lg font-medium hover:bg-accent/90 transition-colors rounded-md"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </>
  )
}
