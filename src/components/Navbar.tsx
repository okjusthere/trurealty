'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'
import type { CompanyInfoRecord } from '@/lib/site'
import { getMediaUrl } from '@/lib/site'
import { cn, formatPhone } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/agents', label: 'Agents' },
  { href: '/listings', label: 'Listings' },
  { href: '/new-developments', label: 'New Developments' },
  { href: '/home-value', label: 'Home Value', highlight: true },
  { href: '/contact', label: 'Contact' },
]

interface NavbarProps {
  companyInfo: CompanyInfoRecord
}

export default function Navbar({ companyInfo }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const phoneNumber = companyInfo.phone || '5168298628'
  const companyName = companyInfo.companyName || 'Tru Realty'
  const chineseName = companyInfo.chineseName || '嘉实地产'
  const logoUrl = getMediaUrl(companyInfo.logo)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      {/* Main navigation */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${companyName} logo`}
                className="h-12 w-auto"
              />
            ) : null}
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-heading text-xl font-bold tracking-wide text-primary">
                {companyName.toUpperCase()}
              </span>
              <span className="text-xs text-muted tracking-widest">
                {chineseName}
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  link.highlight
                    ? 'text-accent font-semibold hover:text-accent/80'
                    : 'text-foreground hover:text-primary',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 -mr-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            mobileMenuOpen ? 'max-h-80 pb-4' : 'max-h-0',
          )}
        >
          <div className="flex flex-col gap-1 pt-2 border-t border-border">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-3 py-2.5 text-sm font-medium rounded-md transition-colors',
                  link.highlight
                    ? 'text-accent font-semibold hover:bg-accent/10'
                    : 'text-foreground hover:bg-muted-bg hover:text-primary',
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-primary"
            >
              <Phone className="h-4 w-4" />
              {formatPhone(phoneNumber)}
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}
