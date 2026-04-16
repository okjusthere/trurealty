'use client'

import { useState, type FormEvent } from 'react'
import { Loader2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

const interestOptions = [
  { value: '', label: 'Select an option' },
  { value: 'buying', label: 'Buying a Home' },
  { value: 'selling', label: 'Selling a Home' },
  { value: 'new-development', label: 'New Development' },
  { value: 'other', label: 'Other' },
]

const inputStyles =
  'w-full px-4 py-2.5 text-sm border border-border rounded-md bg-white text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    // TODO: Replace with server action
    console.log('Contact form submission:', data)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-border bg-muted-bg p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Send className="h-5 w-5 text-green-600" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-foreground">
          Thank You!
        </h3>
        <p className="mt-2 text-sm text-muted">
          We&apos;ve received your message and will get back to you shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Your full name"
          className={inputStyles}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className={inputStyles}
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="(555) 123-4567"
          className={inputStyles}
        />
      </div>

      {/* Interested in */}
      <div>
        <label htmlFor="interest" className="block text-sm font-medium text-foreground mb-1.5">
          Interested In
        </label>
        <select
          id="interest"
          name="interest"
          className={cn(inputStyles, 'appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat')}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          }}
        >
          {interestOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us how we can help you..."
          className={cn(inputStyles, 'resize-vertical')}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-light disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}
