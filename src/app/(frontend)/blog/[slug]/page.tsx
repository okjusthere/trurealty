import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'

function RichText({ content }: { content: any }) {
  if (!content) return <p className="text-muted">Content coming soon.</p>
  if (typeof content === 'string') return <div dangerouslySetInnerHTML={{ __html: content }} />
  if (content?.root?.children) {
    return (
      <div className="prose prose-lg max-w-none">
        {content.root.children.map((node: any, i: number) => {
          if (node.type === 'paragraph') {
            const text = node.children?.map((c: any) => c.text || '').join('') || ''
            return text ? <p key={i}>{text}</p> : <br key={i} />
          }
          if (node.type === 'heading') {
            const text = node.children?.map((c: any) => c.text || '').join('') || ''
            const Tag = (`h${node.tag || 3}`) as keyof JSX.IntrinsicElements
            return <Tag key={i}>{text}</Tag>
          }
          if (node.type === 'list') {
            const ListTag = node.listType === 'number' ? 'ol' : 'ul'
            return (
              <ListTag key={i}>
                {node.children?.map((li: any, j: number) => (
                  <li key={j}>
                    {li.children?.map((c: any) => c.text || '').join('') || ''}
                  </li>
                ))}
              </ListTag>
            )
          }
          const text = node.children?.map((c: any) => c.text || '').join('') || ''
          return text ? <p key={i}>{text}</p> : null
        })}
      </div>
    )
  }
  return <p className="text-muted">Content coming soon.</p>
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const page = pages.docs[0] as any
  if (!page) return { title: 'Post Not Found' }
  return {
    title: `${page.title} | Tru International Realty Corp`,
    description: page.excerpt || `Read ${page.title} on the Tru International Realty Corp blog.`,
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const pages = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const page = pages.docs[0] as any
  if (!page) notFound()

  const imageUrl = page.featuredImage?.url ||
    (page.featuredImage?.filename ? `/media/${page.featuredImage.filename}` : null)

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
          <div className="relative w-full aspect-[16/9] mb-8 bg-muted-bg overflow-hidden">
            <Image src={imageUrl} alt={page.title} fill className="object-cover" />
          </div>
        )}

        {dateStr && <p className="text-sm text-muted mb-2">{dateStr}</p>}

        <h1 className="text-3xl md:text-4xl font-heading text-primary mb-8">
          {page.title}
        </h1>

        <RichText content={page.content} />

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
