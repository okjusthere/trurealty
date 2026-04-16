import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/lib/payload'

export const metadata = {
  title: 'Blog | Tru International Realty Corp',
  description: 'Insights, market updates, and real estate tips from Tru International Realty Corp.',
}

export default async function BlogPage() {
  const payload = await getPayloadClient()

  const posts = await payload.find({
    collection: 'pages',
    where: { pageType: { equals: 'blog' } },
    sort: '-publishedAt',
    limit: 50,
  })

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-heading text-primary mb-2 text-center">Blog</h1>
        <p className="text-muted text-center mb-12">
          Market insights, buying and selling tips, and community news
        </p>

        {posts.docs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.docs.map((post: any) => {
              const imageUrl = post.featuredImage?.url ||
                (post.featuredImage?.filename ? `/media/${post.featuredImage.filename}` : null)
              const dateStr = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : null

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group border border-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {imageUrl ? (
                    <div className="relative aspect-[16/10] bg-muted-bg overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-muted-bg flex items-center justify-center">
                      <span className="text-muted">No Image</span>
                    </div>
                  )}
                  <div className="p-6">
                    {dateStr && (
                      <p className="text-sm text-muted mb-2">{dateStr}</p>
                    )}
                    <h2 className="text-xl font-heading text-primary mb-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted text-sm line-clamp-3">{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-muted py-12">
            No blog posts yet. Check back soon for market insights and tips.
          </p>
        )}
      </div>
    </div>
  )
}
