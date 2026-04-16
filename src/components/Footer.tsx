import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import type { CompanyInfoRecord } from '@/lib/site'
import { getMediaUrl, getServiceAreaNames } from '@/lib/site'
import { formatPhone } from '@/lib/utils'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/agents', label: 'Our Agents' },
  { href: '/listings', label: 'Listings' },
  { href: '/new-developments', label: 'New Developments' },
  { href: '/contact', label: 'Contact Us' },
]

interface FooterProps {
  companyInfo: CompanyInfoRecord
}

export default function Footer({ companyInfo }: FooterProps) {
  const companyName = companyInfo.companyName || 'Tru International Realty Corp'
  const chineseName = companyInfo.chineseName || '嘉实地产'
  const logoUrl = getMediaUrl(companyInfo.logo)
  const slogan =
    companyInfo.slogan ||
    'Your trusted partner in New York real estate, serving the Chinese-American community and beyond.'
  const phoneNumber = companyInfo.phone || '5168298628'
  const email = companyInfo.email || 'info@trurealty.com'
  const address = companyInfo.address
    ? [
        companyInfo.address.street,
        [companyInfo.address.city, companyInfo.address.state, companyInfo.address.zip]
          .filter(Boolean)
          .join(', '),
      ]
        .filter(Boolean)
        .join(', ')
    : 'Great Neck, NY 11021'
  const serviceAreas = getServiceAreaNames(companyInfo.serviceAreas)
  const socialLinks = [
    { label: 'WeChat', href: companyInfo.socialLinks?.wechat || null },
    { label: 'Instagram', href: companyInfo.socialLinks?.instagram || null },
    { label: 'Facebook', href: companyInfo.socialLinks?.facebook || null },
    { label: 'XHS', href: companyInfo.socialLinks?.xiaohongshu || null },
  ]

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company info */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${companyName} logo`}
                  className="h-16 w-auto brightness-0 invert"
                />
              ) : null}
              <div>
                <h3 className="font-heading text-xl font-bold tracking-wide text-white">
                  {companyName.toUpperCase()}
                </h3>
                <p className="text-sm text-white/60 tracking-widest">
                  {chineseName}
                </p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {slogan}
            </p>
            <div className="space-y-2.5 text-sm text-white/70">
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" />
                {formatPhone(phoneNumber)}
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {email}
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading text-base font-semibold mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service areas */}
          <div>
            <h4 className="font-heading text-base font-semibold mb-4 text-white">
              Service Areas
            </h4>
            <ul className="space-y-2.5">
              {(serviceAreas.length > 0
                ? serviceAreas
                : ['Great Neck', 'Flushing', 'Bayside', 'Manhattan']
              ).map((area) => (
                <li key={area} className="text-sm text-white/70">
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Social / Newsletter placeholder */}
          <div>
            <h4 className="font-heading text-base font-semibold mb-4 text-white">
              Connect With Us
            </h4>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              Follow us on social media for the latest listings and market
              updates.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((platform) =>
                platform.href ? (
                  <a
                    key={platform.label}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white/70 hover:bg-accent hover:text-white text-xs font-medium transition-colors"
                  >
                    {platform.label[0]}
                  </a>
                ) : (
                  <span
                    key={platform.label}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white/50 text-xs font-medium"
                  >
                    {platform.label[0]}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p>
              &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-white/80 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white/80 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
