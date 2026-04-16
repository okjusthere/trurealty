import type { GlobalConfig } from 'payload'

export const CompanyInfo: GlobalConfig = {
  slug: 'company-info',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      defaultValue: 'Tru International Realty Corp',
    },
    {
      name: 'chineseName',
      type: 'text',
      defaultValue: '嘉实地产',
    },
    {
      name: 'slogan',
      type: 'text',
      defaultValue: 'Real Estate Expertise. Results You Can Trust.',
    },
    {
      name: 'phone',
      type: 'text',
      defaultValue: '929-806-0505',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'street', type: 'text', defaultValue: '62 Westminster Rd' },
        { name: 'city', type: 'text', defaultValue: 'Great Neck' },
        { name: 'state', type: 'text', defaultValue: 'NY' },
        { name: 'zip', type: 'text', defaultValue: '11020' },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'about',
      type: 'richText',
    },
    {
      name: 'serviceAreas',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'wechat', type: 'text' },
        { name: 'xiaohongshu', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
  ],
}
