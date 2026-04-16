export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy practices for website inquiries and contact requests.',
}

export default function PrivacyPage() {
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-heading text-primary mb-6">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none">
          <p>
            Information submitted through this website is used to respond to your
            inquiry, provide requested real estate information, and improve follow-up
            service.
          </p>
          <p>
            We do not sell your information. Submitted contact data may be stored in
            our website CMS, CRM, or email tools for client service and internal
            record-keeping.
          </p>
          <p>
            If you would like your information removed, contact our office directly.
          </p>
        </div>
      </div>
    </div>
  )
}
