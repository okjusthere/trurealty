import type { CollectionConfig } from 'payload'

export const Listings: CollectionConfig = {
  slug: 'listings',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'status', 'propertyType'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Beautiful 3BR Colonial in Great Neck"' },
    },
    {
      type: 'row',
      fields: [
        { name: 'address', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text', defaultValue: 'NY' },
        { name: 'zip', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'price', type: 'number', required: true },
        { name: 'beds', type: 'number' },
        { name: 'baths', type: 'number' },
        { name: 'sqft', type: 'number' },
      ],
    },
    {
      name: 'propertyType',
      type: 'select',
      options: [
        { label: 'House', value: 'house' },
        { label: 'Condo', value: 'condo' },
        { label: 'Co-op', value: 'coop' },
        { label: 'Townhouse', value: 'townhouse' },
        { label: 'Multi-Family', value: 'multi-family' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Land', value: 'land' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      required: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Pending', value: 'pending' },
        { label: 'Sold', value: 'sold' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'photos',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'virtualTourUrl',
      type: 'text',
      admin: { description: 'Matterport or video tour URL' },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'agent',
      type: 'relationship',
      relationTo: 'agents',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'mlsNumber',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.address && data?.city) {
              return `${data.address}-${data.city}`
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
  ],
}
