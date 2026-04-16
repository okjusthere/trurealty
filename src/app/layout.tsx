import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tru International Realty Corp',
  description: 'New York Real Estate',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
