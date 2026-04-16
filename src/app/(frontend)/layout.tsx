import type { Metadata } from 'next'
import '@/app/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getCompanyInfo } from '@/lib/company'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tru International Realty Corp | New York Real Estate',
  description:
    'Tru International Realty Corp (嘉实地产) is a premier New York real estate brokerage specializing in residential, commercial, and new development properties across Queens, Brooklyn, Manhattan, and Long Island.',
}

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const companyInfo = await getCompanyInfo()

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navbar companyInfo={companyInfo} />
        <main className="flex-1">{children}</main>
        <Footer companyInfo={companyInfo} />
      </body>
    </html>
  )
}
