export const metadata = {
  title: 'Terms of Service | Tru International Realty Corp',
  description: 'Basic terms governing the use of this website.',
}

export default function TermsPage() {
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-heading text-primary mb-6">Terms of Service</h1>
        <div className="prose prose-lg max-w-none">
          <p>
            The content on this website is provided for general informational purposes
            only and does not constitute legal, tax, or financial advice.
          </p>
          <p>
            Property information, pricing, and availability may change without notice.
            Users should verify all details directly with the brokerage or listing
            agent.
          </p>
          <p>
            By submitting a form, you agree that our team may contact you about your
            inquiry using the information you provide.
          </p>
        </div>
      </div>
    </div>
  )
}
