import type { CollectionConfig } from 'payload'

export const NewDevelopments: CollectionConfig = {
  slug: 'new-developments',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'location', 'status', 'featured'],
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
      name: 'location',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Flushing, Queens"' },
    },
    {
      name: 'developer',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'under-construction',
      options: [
        { label: 'Pre-Construction', value: 'pre-construction' },
        { label: 'Under Construction', value: 'under-construction' },
        { label: 'Move-In Ready', value: 'move-in-ready' },
        { label: 'Sold Out', value: 'sold-out' },
      ],
    },
    {
      name: 'priceRange',
      type: 'group',
      fields: [
        { name: 'min', type: 'number', admin: { description: 'Starting price' } },
        { name: 'max', type: 'number', admin: { description: 'Max price' } },
      ],
    },
    {
      name: 'stories',
      type: 'number',
      admin: { description: 'Number of floors/stories' },
    },
    {
      name: 'totalUnits',
      type: 'number',
      admin: { description: 'Number of residences/units' },
    },
    {
      name: 'highlights',
      type: 'array',
      admin: { description: 'Key selling points' },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "Thoughtful Design"' },
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'transportation',
      type: 'textarea',
      admin: { description: 'Nearby transit info (subway, bus, LIRR, etc.)' },
    },
    {
      name: 'neighborhood',
      type: 'textarea',
      admin: { description: 'Nearby shopping, dining, schools, parks, etc.' },
    },
    {
      name: 'unitTypes',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Studio', value: 'studio' },
        { label: '1 Bedroom', value: '1br' },
        { label: '2 Bedroom', value: '2br' },
        { label: '3 Bedroom', value: '3br' },
        { label: '4+ Bedroom', value: '4br-plus' },
      ],
      admin: { description: 'Available unit configurations' },
    },
    {
      name: 'yearBuilt',
      type: 'number',
      admin: { description: 'Year completed or expected completion' },
    },
    {
      name: 'description',
      type: 'richText',
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
      name: 'floorPlans',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          admin: { description: 'e.g. "1BR Unit A"' },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'amenities',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Gym/Fitness Center', value: 'gym' },
        { label: 'Rooftop', value: 'rooftop' },
        { label: 'Parking', value: 'parking' },
        { label: 'Concierge', value: 'concierge' },
        { label: 'Pool', value: 'pool' },
        { label: 'Doorman', value: 'doorman' },
        { label: 'Laundry', value: 'laundry' },
        { label: 'Storage', value: 'storage' },
        { label: 'Pet-Friendly', value: 'pet-friendly' },
        { label: 'Outdoor Space', value: 'outdoor-space' },
        { label: 'EV Charging', value: 'ev-charging' },
        { label: 'Balcony/Terrace', value: 'balcony' },
        { label: 'In-Unit Washer/Dryer', value: 'in-unit-laundry' },
        { label: 'Bike Room', value: 'bike-room' },
        { label: 'Video Intercom', value: 'video-intercom' },
        { label: 'Lounge', value: 'lounge' },
        { label: 'Package Room', value: 'package-room' },
        { label: 'Heated Bathroom Floors', value: 'heated-floors' },
        { label: 'Smart Lock', value: 'smart-lock' },
      ],
    },
    {
      name: 'completionDate',
      type: 'date',
    },
    {
      name: 'contactAgent',
      type: 'relationship',
      relationTo: 'agents',
    },
    {
      name: 'brochureFile',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Upload project brochure PDF' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
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
  ],
}
