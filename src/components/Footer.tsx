import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { formatPhone } from '@/lib/utils'

const PHONE_NUMBER = '5168298628'
const EMAIL = 'info@trurealty.com'
const ADDRESS = 'Great Neck, NY 11021'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/agents', label: 'Our Agents' },
  { href: '/listings', label: 'Listings' },
  { href: '/new-developments', label: 'New Developments' },
  { href: '/contact', label: 'Contact Us' },
]

const serviceAreas = [
  'Great Neck',
  'Manhasset',
  'Roslyn',
  'Port Washington',
  'Kings Point',
  'Flushing',
  'Bayside',
  'Manhattan',
]

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company info */}
          <div className="space-y-4">
            <div>
              <h3 className="font-heading text-xl font-bold tracking-wide text-white">
                TRU REALTY
              </h3>
              <p className="text-sm text-white/60 tracking-widest">
                嘉实地产
              </p>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Tru International Realty Corp. — Your trusted partner in New York
              real estate, serving the Chinese-American community and beyond.
            </p>
            <div className="space-y-2.5 text-sm text-white/70">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0" />
                {formatPhone(PHONE_NUMBER)}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-2 hover:text-accent transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {EMAIL}
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{ADDRESS}</span>
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
              {serviceAreas.map((area) => (
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
              {/* Social link placeholders */}
              {['WeChat', 'Instagram', 'Facebook'].map((platform) => (
                <span
                  key={platform}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white/70 hover:bg-accent hover:text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  {platform[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
            <p>
              &copy; {new Date().getFullYear()} Tru International Realty Corp.
              All rights reserved.
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
