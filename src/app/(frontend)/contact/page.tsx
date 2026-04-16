import { getPayloadClient } from '@/lib/payload'
import { formatPhone } from '@/lib/utils'
import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Contact Us | Tru International Realty Corp',
  description: 'Get in touch with Tru International Realty Corp. We are here to help with all your real estate needs.',
}

export default async function ContactPage() {
  const payload = await getPayloadClient()
  const companyInfo = await payload.findGlobal({ slug: 'company-info' }) as any

  const address = companyInfo?.address
  const fullAddress = address
    ? `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.zip || ''}`
    : '62 Westminster Rd, Great Neck, NY 11020'

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-heading text-primary mb-2 text-center">Contact Us</h1>
        <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
          Have a question or ready to start your real estate journey? We would love to hear from you.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-heading text-primary mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>

          {/* Company Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-heading text-primary mb-6">Our Office</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-primary">
                    {companyInfo?.companyName || 'Tru International Realty Corp'}
                  </h3>
                  {companyInfo?.chineseName && (
                    <p className="text-muted">{companyInfo.chineseName}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted uppercase tracking-wide mb-1">Address</p>
                  <p className="text-foreground">
                    {address?.street || '62 Westminster Rd'}
                    <br />
                    {address?.city || 'Great Neck'}, {address?.state || 'NY'}{' '}
                    {address?.zip || '11020'}
                  </p>
                </div>

                {companyInfo?.phone && (
                  <div>
                    <p className="text-sm text-muted uppercase tracking-wide mb-1">Phone</p>
                    <a
                      href={`tel:${companyInfo.phone}`}
                      className="text-accent hover:underline"
                    >
                      {formatPhone(companyInfo.phone)}
                    </a>
                  </div>
                )}

                {companyInfo?.email && (
                  <div>
                    <p className="text-sm text-muted uppercase tracking-wide mb-1">Email</p>
                    <a
                      href={`mailto:${companyInfo.email}`}
                      className="text-accent hover:underline"
                    >
                      {companyInfo.email}
                    </a>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted uppercase tracking-wide mb-1">Office Hours</p>
                  <p className="text-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-foreground">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-foreground">Sunday: By Appointment</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-muted-bg border border-border aspect-[4/3] flex flex-col items-center justify-center p-6">
              <p className="text-muted text-lg mb-2">Map</p>
              <p className="text-sm text-muted text-center">{fullAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
