import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'sourceType', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'interest',
      type: 'select',
      options: [
        { label: 'Buying a Home', value: 'buying' },
        { label: 'Selling a Home', value: 'selling' },
        { label: 'New Development', value: 'new-development' },
        { label: 'Investment', value: 'investment' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sourceType',
          type: 'select',
          defaultValue: 'general',
          options: [
            { label: 'General', value: 'general' },
            { label: 'Agent Page', value: 'agent' },
            { label: 'Listing Page', value: 'listing' },
            { label: 'New Development', value: 'development' },
            { label: 'Landing Page', value: 'landing' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'new',
          options: [
            { label: 'New', value: 'new' },
            { label: 'Contacted', value: 'contacted' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'Closed', value: 'closed' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sourceLabel',
          type: 'text',
        },
        {
          name: 'sourceSlug',
          type: 'text',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'agent',
          type: 'relationship',
          relationTo: 'agents',
        },
        {
          name: 'listing',
          type: 'relationship',
          relationTo: 'listings',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'development',
          type: 'relationship',
          relationTo: 'new-developments',
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'utmSource',
          type: 'text',
          admin: { position: 'sidebar' },
        },
        {
          name: 'utmMedium',
          type: 'text',
          admin: { position: 'sidebar' },
        },
        {
          name: 'utmCampaign',
          type: 'text',
          admin: { position: 'sidebar' },
        },
      ],
    },
    {
      name: 'pageUrl',
      type: 'text',
      admin: { position: 'sidebar' },
    },
  ],
}
