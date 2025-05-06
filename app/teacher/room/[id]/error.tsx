'use client' // Error boundaries must be Client Components
 
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.log(error)
    console.log(error==`PostgresError: invalid input syntax for type uuid: "59087121-b46e-4070-bd1d-fed39af756"`)
  }, [error])
 
  return (
    <div>
        {error==`PostgresError: invalid input syntax for type uuid: "59087121-b46e-4070-bd1d-fed39af756"`?<>
        
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
                  <div className="text-xl font-semibold text-red-600">Room not found</div>
                  <div className="mt-2 text-gray-600">The room you're trying to access might have been deleted or you don't have access.</div>
                  <Link href="/teacher">
                  <Button className="mt-4" >
                    Go to Dashboard
                  </Button>
                  </Link>
                </div></>:
      <h2>Something went wrong!</h2>}
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}