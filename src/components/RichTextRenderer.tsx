import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { LexicalNode, RichTextContent } from '@/lib/site'

const headingTagMap = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} as const

function getHeadingLevel(value: number): keyof typeof headingTagMap {
  if (value <= 1) return 1
  if (value === 2) return 2
  if (value === 3) return 3
  if (value === 4) return 4
  if (value === 5) return 5
  return 6
}

function getNodeText(node?: LexicalNode): string {
  if (!node) {
    return ''
  }

  if (typeof node.text === 'string') {
    return node.text
  }

  return (node.children ?? []).map((child) => getNodeText(child)).join('')
}

function renderListItem(node: LexicalNode, index: number): ReactNode {
  const itemText = node.children?.map((child) => getNodeText(child)).join('') ?? ''

  if (!itemText) {
    return null
  }

  return <li key={`item-${index}`}>{itemText}</li>
}

function renderNode(node: LexicalNode, index: number): ReactNode {
  if (node.type === 'paragraph') {
    const text = getNodeText(node)
    return text ? <p key={`paragraph-${index}`}>{text}</p> : <br key={`break-${index}`} />
  }

  if (node.type === 'heading') {
    const text = getNodeText(node)
    const rawLevel = Number.parseInt(String(node.tag ?? 3), 10)
    const level = Number.isNaN(rawLevel) ? 3 : getHeadingLevel(rawLevel)
    const HeadingTag = headingTagMap[level]

    return text ? <HeadingTag key={`heading-${index}`}>{text}</HeadingTag> : null
  }

  if (node.type === 'list') {
    const ListTag = node.listType === 'number' ? 'ol' : 'ul'
    const items =
      node.children
        ?.map((child, childIndex) => renderListItem(child, childIndex))
        .filter(Boolean) ?? []

    return items.length > 0 ? <ListTag key={`list-${index}`}>{items}</ListTag> : null
  }

  const text = getNodeText(node)
  return text ? <p key={`fallback-${index}`}>{text}</p> : null
}

interface RichTextRendererProps {
  content: RichTextContent
  className?: string
  emptyMessage?: string
}

export default function RichTextRenderer({
  content,
  className,
  emptyMessage = 'Content coming soon.',
}: RichTextRendererProps) {
  if (!content) {
    return <p className="text-muted">{emptyMessage}</p>
  }

  if (typeof content === 'string') {
    return (
      <div
        className={cn('prose prose-lg max-w-none', className)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  const nodes = content.root?.children ?? []

  if (nodes.length === 0) {
    return <p className="text-muted">{emptyMessage}</p>
  }

  return (
    <div className={cn('prose prose-lg max-w-none', className)}>
      {nodes.map((node, index) => renderNode(node, index))}
    </div>
  )
}
