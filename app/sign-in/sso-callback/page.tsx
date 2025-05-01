import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'
import React from 'react'

function SsoCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <AuthenticateWithRedirectCallback 
    signInFallbackRedirectUrl="/sign-in"
    signUpFallbackRedirectUrl="/sign-in"
  />
    </div>
  )
}

export default SsoCallback