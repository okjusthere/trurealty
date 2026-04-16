export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'
import ContactForm from '@/components/ContactForm'
import RichTextRenderer from '@/components/RichTextRenderer'
import { getMediaUrl, type PageRecord } from '@/lib/site'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const pages = await payload.find({
    collection: 'pages',
    where: {
      and: [{ slug: { equals: slug } }, { pageType: { equals: 'landing' } }],
    },
    limit: 1,
  })

  const page = pages.docs[0] as PageRecord | undefined

  if (!page) {
    return { title: 'Page Not Found' }
  }

  return {
    title: `${page.title} | Tru International Realty Corp`,
    description:
      page.excerpt ||
      `${page.title} - landing page for campaign traffic and inbound inquiries.`,
  }
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const pages = await payload.find({
    collection: 'pages',
    where: {
      and: [{ slug: { equals: slug } }, { pageType: { equals: 'landing' } }],
    },
    limit: 1,
  })

  const page = pages.docs[0] as PageRecord | undefined

  if (!page) {
    notFound()
  }

  const imageUrl = getMediaUrl(page.featuredImage)

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-10">
          <div>
            {imageUrl && (
              <div className="relative w-full aspect-[16/9] mb-8 overflow-hidden rounded-2xl bg-muted-bg">
                <Image src={imageUrl} alt={page.title} fill className="object-cover" />
              </div>
            )}

            <p className="text-sm uppercase tracking-[0.2em] text-accent mb-3">
              Campaign Landing Page
            </p>
            <h1 className="text-4xl md:text-5xl font-heading text-primary mb-4">
              {page.title}
            </h1>
            {page.excerpt && (
              <p className="text-lg text-muted max-w-3xl mb-8">{page.excerpt}</p>
            )}

            <RichTextRenderer content={page.content} />
          </div>

          <aside className="rounded-2xl border border-border bg-white p-6 h-fit">
            <h2 className="text-xl font-heading text-primary mb-3">
              Request More Information
            </h2>
            <p className="text-sm text-muted mb-5">
              This form submission is tagged to the landing page so campaign traffic
              has a real destination and a recoverable lead record.
            </p>
            <ContactForm
              context={{
                sourceType: 'landing',
                sourceLabel: page.title,
                sourceSlug: page.slug,
                pageId: page.id,
              }}
              successMessage="Your request has been captured from this landing page."
            />
          </aside>
        </div>
      </div>
    </div>
  )
}
