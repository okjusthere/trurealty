import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Agents } from './collections/Agents'
import { Listings } from './collections/Listings'
import { NewDevelopments } from './collections/NewDevelopments'
import { Pages } from './collections/Pages'
import { Testimonials } from './collections/Testimonials'
import { Media } from './collections/Media'
import { CompanyInfo } from './globals/CompanyInfo'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Agents, Listings, NewDevelopments, Pages, Testimonials],
  globals: [CompanyInfo],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'tru-realty-dev-secret-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./trurealty.db',
    },
  }),
  sharp,
})
