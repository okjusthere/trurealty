'use client'

import { useState, type FormEvent } from 'react'
import { Search } from 'lucide-react'

const ONEKEY_OFFICE_KEY = '326109598'
const ONEKEY_OFFICE_NAME = 'Tru International Realty Corp'
const ONEKEY_BASE_URL = 'https://www.onekeymls.com/homes-for-sale/homes'

export default function OneKeySearchBox() {
  const [query, setQuery] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const params = new URLSearchParams({
      listOfficeKey: ONEKEY_OFFICE_KEY,
      listOfficeName: ONEKEY_OFFICE_NAME,
    })
    const trimmed = query.trim()
    if (trimmed) {
      params.set('SearchText', trimmed)
    }
    const url = `${ONEKEY_BASE_URL}?${params.toString()}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mb-6 flex items-stretch gap-2 rounded-lg border border-border bg-white p-1 shadow-sm"
    >
      <div className="flex items-center gap-2 flex-1 px-3">
        <Search className="h-4 w-4 text-muted shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by city, neighborhood, or address…"
          className="w-full py-2.5 text-sm bg-transparent focus:outline-none placeholder:text-muted/70"
        />
      </div>
      <button
        type="submit"
        className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-light transition-colors"
      >
        Search on OneKey
      </button>
    </form>
  )
}
