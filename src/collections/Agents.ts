import type { CollectionConfig } from 'payload'

export const Agents: CollectionConfig = {
  slug: 'agents',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'phone', 'status'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'select',
      options: [
        { label: 'Broker', value: 'broker' },
        { label: 'Associate Broker', value: 'associate-broker' },
        { label: 'REALTOR®', value: 'realtor' },
        { label: 'Licensed Salesperson', value: 'salesperson' },
      ],
      required: true,
    },
    {
      name: 'credentials',
      type: 'text',
      admin: { description: 'e.g. CBR, GRI, CIPS' },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'richText',
    },
    {
      name: 'specialties',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Residential', value: 'residential' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'New Development', value: 'new-development' },
        { label: 'Investment', value: 'investment' },
        { label: 'Luxury', value: 'luxury' },
        { label: 'Rental', value: 'rental' },
      ],
    },
    {
      name: 'serviceAreas',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Queens', value: 'queens' },
        { label: 'Brooklyn', value: 'brooklyn' },
        { label: 'Manhattan', value: 'manhattan' },
        { label: 'Bronx', value: 'bronx' },
        { label: 'Nassau County', value: 'nassau' },
        { label: 'Suffolk County', value: 'suffolk' },
        { label: 'Long Island', value: 'long-island' },
      ],
    },
    {
      name: 'languages',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'English', value: 'english' },
        { label: 'Mandarin', value: 'mandarin' },
        { label: 'Cantonese', value: 'cantonese' },
        { label: 'Spanish', value: 'spanish' },
        { label: 'Korean', value: 'korean' },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
