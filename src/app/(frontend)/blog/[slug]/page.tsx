import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
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
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const page = pages.docs[0] as PageRecord | undefined

  if (!page) {
    return { title: 'Post Not Found' }
  }

  return {
    title: `${page.title} | Tru International Realty Corp`,
    description:
      page.excerpt ||
      `Read ${page.title} on the Tru International Realty Corp blog.`,
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const page = pages.docs[0] as PageRecord | undefined

  if (!page) {
    notFound()
  }

  const imageUrl = getMediaUrl(page.featuredImage)
  const dateStr = page.publishedAt
    ? new Date(page.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/blog"
          className="inline-flex items-center text-accent hover:underline mb-8"
        >
          &larr; Back to Blog
        </Link>

        {imageUrl && (
          <div className="relative w-full aspect-[16/9] mb-8 bg-muted-bg overflow-hidden rounded-xl">
            <Image src={imageUrl} alt={page.title} fill className="object-cover" />
          </div>
        )}

        {dateStr && <p className="text-sm text-muted mb-2">{dateStr}</p>}

        <h1 className="text-3xl md:text-4xl font-heading text-primary mb-8">
          {page.title}
        </h1>

        <RichTextRenderer content={page.content} />

        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/blog"
            className="inline-flex items-center text-accent hover:underline"
          >
            &larr; Back to Blog
          </Link>
        </div>
      </div>
    </div>
  )
}
