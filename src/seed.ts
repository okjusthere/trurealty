import { getPayload } from 'payload'
import config from './payload.config'

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Seeding database...')

  // Create admin user
  try {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@trurealtycorp.com',
        password: 'admin123',
        name: 'Admin',
      },
    })
    console.log('✅ Admin user created')
  } catch (e) {
    console.log('ℹ️  Admin user already exists')
  }

  // Seed Agents
  const agents = [
    {
      name: 'Riva Zheng',
      title: 'broker' as const,
      phone: '929-806-0505',
      email: 'riva.zheng@trurealtycorp.com',
      specialties: ['residential', 'new-development', 'luxury'] as const[],
      serviceAreas: ['queens', 'brooklyn', 'manhattan', 'nassau'] as const[],
      languages: ['english', 'mandarin'] as const[],
      slug: 'riva-zheng',
      sortOrder: 1,
      featured: true,
      status: 'active' as const,
    },
    {
      name: 'Ling Xiang',
      title: 'realtor' as const,
      phone: '347-925-7557',
      email: 'ling.xiang@trurealtycorp.com',
      specialties: ['residential', 'new-development'] as const[],
      serviceAreas: ['queens', 'brooklyn'] as const[],
      languages: ['english', 'mandarin'] as const[],
      slug: 'ling-xiang',
      sortOrder: 2,
      featured: true,
      status: 'active' as const,
    },
    {
      name: 'Min Yue Dong',
      title: 'realtor' as const,
      phone: '917-285-5628',
      email: 'minyue.dong@trurealtycorp.com',
      specialties: ['residential', 'rental'] as const[],
      serviceAreas: ['queens', 'nassau', 'long-island'] as const[],
      languages: ['english', 'mandarin'] as const[],
      slug: 'min-yue-dong',
      sortOrder: 3,
      featured: true,
      status: 'active' as const,
    },
    {
      name: 'Kien S. Chow',
      title: 'associate-broker' as const,
      credentials: 'CBR, GRI',
      phone: '917-415-4955',
      email: 'kien.chow@trurealtycorp.com',
      specialties: ['residential', 'commercial', 'investment'] as const[],
      serviceAreas: ['queens', 'brooklyn', 'manhattan'] as const[],
      languages: ['english', 'cantonese', 'mandarin'] as const[],
      slug: 'kien-s-chow',
      sortOrder: 4,
      featured: true,
      status: 'active' as const,
    },
    {
      name: 'Yingzhen Zhang',
      title: 'realtor' as const,
      phone: '718-888-9988',
      email: 'yingzhen.zhang@trurealtycorp.com',
      specialties: ['residential', 'new-development'] as const[],
      serviceAreas: ['queens', 'nassau'] as const[],
      languages: ['english', 'mandarin'] as const[],
      slug: 'yingzhen-zhang',
      sortOrder: 5,
      featured: false,
      status: 'active' as const,
    },
    {
      name: 'Guang Yang Li',
      title: 'realtor' as const,
      phone: '347-439-9466',
      email: 'guangyang.li@trurealtycorp.com',
      specialties: ['residential', 'rental'] as const[],
      serviceAreas: ['queens', 'nassau', 'long-island'] as const[],
      languages: ['english', 'mandarin'] as const[],
      slug: 'guang-yang-li',
      sortOrder: 6,
      featured: false,
      status: 'active' as const,
    },
  ]

  const agentIds: Record<string, number> = {}
  for (const agent of agents) {
    try {
      const created = await payload.create({
        collection: 'agents',
        data: agent as any,
      })
      agentIds[agent.slug] = created.id as number
      console.log(`✅ Agent: ${agent.name}`)
    } catch (e: any) {
      console.log(`ℹ️  Agent ${agent.name} may already exist: ${e.message?.slice(0, 50)}`)
    }
  }

  // Seed New Developments
  const developments = [
    {
      name: 'Fowler Park',
      location: 'Brooklyn, NY',
      developer: 'Fowler Park Development LLC',
      status: 'move-in-ready' as const,
      priceRange: { min: 550000, max: 1200000 },
      totalUnits: 120,
      amenities: ['gym', 'rooftop', 'parking', 'concierge', 'laundry', 'pet-friendly'] as const[],
      featured: true,
      slug: 'fowler-park',
      contactAgent: agentIds['riva-zheng'],
    },
    {
      name: 'Longfield',
      location: 'Flushing, Queens',
      developer: 'Longfield Realty Corp',
      status: 'under-construction' as const,
      priceRange: { min: 480000, max: 950000 },
      totalUnits: 85,
      amenities: ['gym', 'parking', 'laundry', 'storage', 'outdoor-space'] as const[],
      featured: true,
      slug: 'longfield',
      contactAgent: agentIds['ling-xiang'],
    },
    {
      name: 'CKZ Tower',
      location: 'Rego Park, Queens',
      developer: 'CKZ Development Group',
      status: 'under-construction' as const,
      priceRange: { min: 620000, max: 1500000 },
      totalUnits: 200,
      amenities: ['gym', 'rooftop', 'parking', 'concierge', 'pool', 'doorman', 'ev-charging'] as const[],
      featured: true,
      slug: 'ckz-tower',
      contactAgent: agentIds['riva-zheng'],
    },
    {
      name: 'East West Plaza',
      location: 'Flushing, Queens',
      developer: 'East West Realty',
      status: 'move-in-ready' as const,
      priceRange: { min: 380000, max: 750000 },
      totalUnits: 60,
      amenities: ['parking', 'laundry', 'storage'] as const[],
      featured: true,
      slug: 'east-west-plaza',
      contactAgent: agentIds['min-yue-dong'],
    },
    {
      name: 'Harvest Plaza',
      location: 'Elmhurst, Queens',
      developer: 'Harvest Development',
      status: 'pre-construction' as const,
      priceRange: { min: 450000, max: 880000 },
      totalUnits: 95,
      amenities: ['gym', 'parking', 'rooftop', 'laundry', 'pet-friendly'] as const[],
      featured: true,
      slug: 'harvest-plaza',
      contactAgent: agentIds['kien-s-chow'],
    },
    {
      name: 'Four Points',
      location: 'Long Island City, Queens',
      developer: 'Four Points Development',
      status: 'under-construction' as const,
      priceRange: { min: 700000, max: 2000000 },
      totalUnits: 150,
      amenities: ['gym', 'rooftop', 'parking', 'concierge', 'pool', 'doorman', 'ev-charging', 'outdoor-space'] as const[],
      featured: true,
      slug: 'four-points',
      contactAgent: agentIds['riva-zheng'],
    },
  ]

  for (const dev of developments) {
    try {
      await payload.create({
        collection: 'new-developments',
        data: dev as any,
      })
      console.log(`✅ Development: ${dev.name}`)
    } catch (e: any) {
      console.log(`ℹ️  Development ${dev.name} may already exist: ${e.message?.slice(0, 50)}`)
    }
  }

  // Seed Listings
  const listings = [
    {
      title: 'Spacious 3BR Colonial in Great Neck',
      address: '125 Maple Drive',
      city: 'Great Neck',
      state: 'NY',
      zip: '11020',
      price: 1250000,
      beds: 3,
      baths: 2.5,
      sqft: 2400,
      propertyType: 'house' as const,
      status: 'active' as const,
      featured: true,
      slug: '125-maple-drive-great-neck',
      agent: agentIds['riva-zheng'],
    },
    {
      title: 'Modern 2BR Condo in Flushing',
      address: '136-20 Sanford Ave',
      city: 'Flushing',
      state: 'NY',
      zip: '11355',
      price: 680000,
      beds: 2,
      baths: 2,
      sqft: 1100,
      propertyType: 'condo' as const,
      status: 'active' as const,
      featured: true,
      slug: '136-20-sanford-ave-flushing',
      agent: agentIds['ling-xiang'],
    },
    {
      title: 'Renovated 4BR in Bayside',
      address: '42-15 Bell Blvd',
      city: 'Bayside',
      state: 'NY',
      zip: '11361',
      price: 1580000,
      beds: 4,
      baths: 3,
      sqft: 3200,
      propertyType: 'house' as const,
      status: 'active' as const,
      featured: true,
      slug: '42-15-bell-blvd-bayside',
      agent: agentIds['kien-s-chow'],
    },
    {
      title: 'Luxury 1BR at Fowler Park',
      address: '88 Fowler Park Way, Unit 12C',
      city: 'Brooklyn',
      state: 'NY',
      zip: '11201',
      price: 750000,
      beds: 1,
      baths: 1,
      sqft: 780,
      propertyType: 'condo' as const,
      status: 'pending' as const,
      featured: false,
      slug: '88-fowler-park-way-unit-12c',
      agent: agentIds['riva-zheng'],
    },
    {
      title: 'Charming Co-op in Forest Hills',
      address: '108-50 Queens Blvd',
      city: 'Forest Hills',
      state: 'NY',
      zip: '11375',
      price: 420000,
      beds: 2,
      baths: 1,
      sqft: 950,
      propertyType: 'coop' as const,
      status: 'sold' as const,
      featured: false,
      slug: '108-50-queens-blvd-forest-hills',
      agent: agentIds['min-yue-dong'],
    },
  ]

  for (const listing of listings) {
    try {
      await payload.create({
        collection: 'listings',
        data: listing as any,
      })
      console.log(`✅ Listing: ${listing.title}`)
    } catch (e: any) {
      console.log(`ℹ️  Listing ${listing.title} may already exist: ${e.message?.slice(0, 50)}`)
    }
  }

  // Seed Testimonials
  const testimonials = [
    {
      clientName: 'Jennifer & Michael W.',
      content: 'Riva and her team were absolutely amazing throughout our home buying journey. They understood exactly what we were looking for and found us the perfect home in Great Neck. Their knowledge of the local market is unmatched.',
      rating: 5,
      transactionType: 'buyer' as const,
      agent: agentIds['riva-zheng'],
      featured: true,
    },
    {
      clientName: 'David Chen',
      content: 'I sold my property in Flushing with Tru Realty and could not be happier. They got us 15% above asking price! Professional photography, staging advice, and excellent negotiation skills.',
      rating: 5,
      transactionType: 'seller' as const,
      agent: agentIds['ling-xiang'],
      featured: true,
    },
    {
      clientName: 'Lisa & Tom K.',
      content: 'As first-time buyers, we were nervous about the process. Min Yue was patient, knowledgeable, and always available to answer our questions. She made our dream of homeownership a reality.',
      rating: 5,
      transactionType: 'buyer' as const,
      agent: agentIds['min-yue-dong'],
      featured: true,
    },
    {
      clientName: 'Robert Liu',
      content: 'Kien helped us purchase an investment property in Brooklyn. His commercial real estate expertise and bilingual abilities made the complex transaction smooth. Highly recommended for serious investors.',
      rating: 5,
      transactionType: 'buyer' as const,
      agent: agentIds['kien-s-chow'],
      featured: true,
    },
    {
      clientName: 'Sarah Wang',
      content: 'We bought a unit at the Longfield development through Tru Realty. They knew every detail about the project and helped us choose the best unit and negotiate a great price. The bilingual support was invaluable for our family.',
      rating: 5,
      transactionType: 'buyer' as const,
      agent: agentIds['ling-xiang'],
      featured: true,
    },
  ]

  for (const testimonial of testimonials) {
    try {
      await payload.create({
        collection: 'testimonials',
        data: testimonial as any,
      })
      console.log(`✅ Testimonial: ${testimonial.clientName}`)
    } catch (e: any) {
      console.log(`ℹ️  Testimonial ${testimonial.clientName} may already exist: ${e.message?.slice(0, 50)}`)
    }
  }

  // Seed Blog Posts
  const blogPosts = [
    {
      title: 'First-Time Home Buyer Guide for New York',
      pageType: 'blog' as const,
      excerpt: 'Everything you need to know about buying your first home in New York City and Long Island, from pre-approval to closing.',
      publishedAt: '2026-03-15',
      slug: 'first-time-home-buyer-guide-ny',
    },
    {
      title: 'Top 5 Neighborhoods in Queens for Families',
      pageType: 'community' as const,
      excerpt: 'Discover the best family-friendly neighborhoods in Queens with excellent schools, parks, and community amenities.',
      publishedAt: '2026-03-01',
      slug: 'top-5-neighborhoods-queens-families',
    },
    {
      title: 'Understanding NYC Co-op vs Condo: A Complete Guide',
      pageType: 'blog' as const,
      excerpt: 'Learn the key differences between co-ops and condos in New York City to make an informed purchasing decision.',
      publishedAt: '2026-02-20',
      slug: 'nyc-coop-vs-condo-guide',
    },
  ]

  for (const post of blogPosts) {
    try {
      await payload.create({
        collection: 'pages',
        data: post as any,
      })
      console.log(`✅ Blog: ${post.title}`)
    } catch (e: any) {
      console.log(`ℹ️  Blog ${post.title} may already exist: ${e.message?.slice(0, 50)}`)
    }
  }

  console.log('\n🎉 Seeding complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
