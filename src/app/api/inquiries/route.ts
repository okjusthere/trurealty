import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import type { InquiryContext, InquirySourceType, InterestValue } from '@/lib/site'

interface InquiryRequestBody {
  name?: unknown
  email?: unknown
  phone?: unknown
  interest?: unknown
  message?: unknown
  pageUrl?: unknown
  context?: InquiryContext
}

const sourceTypes = new Set<InquirySourceType>([
  'general',
  'agent',
  'listing',
  'development',
  'landing',
])

const interestValues = new Set<InterestValue>([
  '',
  'buying',
  'selling',
  'new-development',
  'investment',
  'other',
])

function getTrimmedString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

function getOptionalId(value: unknown): number | string | undefined {
  return typeof value === 'number' || typeof value === 'string' ? value : undefined
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function parseTrackingParams(pageUrl?: string) {
  if (!pageUrl) {
    return {
      utmSource: undefined,
      utmMedium: undefined,
      utmCampaign: undefined,
    }
  }

  try {
    const url = new URL(pageUrl)

    return {
      utmSource: getTrimmedString(url.searchParams.get('utm_source')),
      utmMedium: getTrimmedString(url.searchParams.get('utm_medium')),
      utmCampaign: getTrimmedString(url.searchParams.get('utm_campaign')),
    }
  } catch {
    return {
      utmSource: undefined,
      utmMedium: undefined,
      utmCampaign: undefined,
    }
  }
}

export async function POST(request: Request) {
  let payloadBody: InquiryRequestBody

  try {
    payloadBody = (await request.json()) as InquiryRequestBody
  } catch {
    return NextResponse.json(
      { message: 'Invalid request payload.' },
      { status: 400 },
    )
  }

  const name = getTrimmedString(payloadBody.name)
  const email = getTrimmedString(payloadBody.email)
  const phone = getTrimmedString(payloadBody.phone)
  const message = getTrimmedString(payloadBody.message)
  const pageUrl = getTrimmedString(payloadBody.pageUrl)

  if (!name || !email || !message) {
    return NextResponse.json(
      { message: 'Name, email, and message are required.' },
      { status: 400 },
    )
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { message: 'Please provide a valid email address.' },
      { status: 400 },
    )
  }

  const context = payloadBody.context ?? {}
  const sourceType = sourceTypes.has(context.sourceType ?? 'general')
    ? (context.sourceType ?? 'general')
    : 'general'

  const interestCandidate = getTrimmedString(payloadBody.interest) ?? ''
  const interest = interestValues.has(interestCandidate as InterestValue)
    ? (interestCandidate as InterestValue)
    : undefined

  const { utmSource, utmMedium, utmCampaign } = parseTrackingParams(pageUrl)

  try {
    const payload = await getPayloadClient()

    await payload.create({
      collection: 'inquiries',
      data: {
        name,
        email,
        phone,
        interest,
        message,
        sourceType,
        sourceLabel: getTrimmedString(context.sourceLabel),
        sourceSlug: getTrimmedString(context.sourceSlug),
        agent: getOptionalId(context.agentId),
        listing: getOptionalId(context.listingId),
        development: getOptionalId(context.developmentId),
        page: getOptionalId(context.pageId),
        pageUrl,
        utmSource,
        utmMedium,
        utmCampaign,
        status: 'new',
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to create inquiry', error)

    return NextResponse.json(
      { message: 'Unable to submit your request right now.' },
      { status: 500 },
    )
  }
}
