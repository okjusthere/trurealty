import type { CollectionConfig } from 'payload'
import path from 'path'

const mediaDir = process.env.MEDIA_DIR || path.resolve('public/media')

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    staticDir: mediaDir,
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
