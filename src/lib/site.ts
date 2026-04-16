export type ID = number | string

export type InquirySourceType =
  | 'general'
  | 'agent'
  | 'listing'
  | 'development'
  | 'landing'

export type InterestValue =
  | ''
  | 'buying'
  | 'selling'
  | 'new-development'
  | 'investment'
  | 'other'

export interface MediaAsset {
  id?: ID
  url?: string | null
  filename?: string | null
  alt?: string | null
}

export interface LexicalNode {
  type?: string
  tag?: number | string
  listType?: 'number' | 'bullet' | 'check'
  text?: string
  children?: LexicalNode[]
}

export interface LexicalDocument {
  root?: {
    children?: LexicalNode[]
  }
}

export type RichTextContent = LexicalDocument | string | null | undefined

export type RelationshipValue<T> = T | ID | null | undefined

export interface AddressGroup {
  street?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
}

export interface AgentRecord {
  id: ID
  slug: string
  name: string
  title?: string | null
  credentials?: string | null
  phone?: string | null
  email?: string | null
  photo?: RelationshipValue<MediaAsset>
  bio?: RichTextContent
  specialties?: string[] | null
  serviceAreas?: string[] | null
  languages?: string[] | null
  sortOrder?: number | null
  featured?: boolean | null
  status?: string | null
}

export interface ListingPhoto {
  image?: RelationshipValue<MediaAsset>
}

export interface ListingRecord {
  id: ID
  slug: string
  title: string
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  price?: number | null
  beds?: number | null
  baths?: number | null
  sqft?: number | null
  propertyType?: string | null
  status?: string | null
  photos?: ListingPhoto[] | null
  virtualTourUrl?: string | null
  description?: RichTextContent
  agent?: RelationshipValue<AgentRecord>
  featured?: boolean | null
  mlsNumber?: string | null
}

export interface DevelopmentHighlight {
  title?: string | null
  content?: string | null
}

export interface DevelopmentFloorPlan {
  name?: string | null
  image?: RelationshipValue<MediaAsset>
}

export interface DevelopmentRecord {
  id: ID
  slug: string
  name: string
  location?: string | null
  developer?: string | null
  status?: string | null
  priceRange?: {
    min?: number | null
    max?: number | null
  } | null
  stories?: number | null
  totalUnits?: number | null
  highlights?: DevelopmentHighlight[] | null
  transportation?: string | null
  neighborhood?: string | null
  unitTypes?: string[] | null
  yearBuilt?: number | null
  description?: RichTextContent
  photos?: ListingPhoto[] | null
  floorPlans?: DevelopmentFloorPlan[] | null
  amenities?: string[] | null
  completionDate?: string | null
  contactAgent?: RelationshipValue<AgentRecord>
  brochureFile?: RelationshipValue<MediaAsset>
  featured?: boolean | null
}

export interface TestimonialRecord {
  id: ID
  clientName: string
  content: string
  rating?: number | null
  transactionType?: string | null
  agent?: RelationshipValue<AgentRecord>
  featured?: boolean | null
}

export type PageType = 'blog' | 'community' | 'resource' | 'landing'

export interface PageRecord {
  id: ID
  title: string
  pageType?: PageType | null
  excerpt?: string | null
  content?: RichTextContent
  featuredImage?: RelationshipValue<MediaAsset>
  publishedAt?: string | null
  slug: string
}

export interface CompanyInfoRecord {
  companyName?: string | null
  chineseName?: string | null
  slogan?: string | null
  phone?: string | null
  email?: string | null
  address?: AddressGroup | null
  logo?: RelationshipValue<MediaAsset>
  heroImage?: RelationshipValue<MediaAsset>
  about?: RichTextContent
  serviceAreas?: Array<{ name?: string | null }> | null
  socialLinks?: {
    facebook?: string | null
    instagram?: string | null
    wechat?: string | null
    xiaohongshu?: string | null
    youtube?: string | null
  } | null
}

export interface InquiryContext {
  sourceType?: InquirySourceType
  sourceLabel?: string
  sourceSlug?: string
  agentId?: ID | null
  listingId?: ID | null
  developmentId?: ID | null
  pageId?: ID | null
}

export function isPopulatedDoc<T extends object>(
  value: RelationshipValue<T>,
): value is T {
  return typeof value === 'object' && value !== null
}

export function getMediaUrl(value: RelationshipValue<MediaAsset>): string | null {
  if (!isPopulatedDoc(value)) {
    return null
  }

  if (value.url) {
    return value.url
  }

  return value.filename ? `/media/${value.filename}` : null
}

export function getPrimaryImageUrl(items?: ListingPhoto[] | null): string | null {
  return getMediaUrl(items?.[0]?.image)
}

export function getServiceAreaNames(
  value?: Array<{ name?: string | null }> | null,
): string[] {
  return (value ?? [])
    .map((item) => item.name?.trim())
    .filter((item): item is string => Boolean(item))
}
