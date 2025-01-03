'use client'

import { useRouter } from 'next/navigation'
import Dashboard from './dashboard/page';

export default function Page() {
  const router = useRouter()

  return (
    <>
      <Dashboard />
    </>
  )
}