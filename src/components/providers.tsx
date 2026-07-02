'use client'

import { ThemeProvider } from "next-themes"
import { useEffect } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force LIGHT mode only - remove dark class
    document.documentElement.classList.remove('dark')
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  )
}
