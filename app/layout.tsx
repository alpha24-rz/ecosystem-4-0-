import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Better font loading behavior
  variable: '--font-inter', // CSS variable for potential future use
})

export const metadata: Metadata = {
  title: {
    default: "Ecosystem 4.0 - Environmental NFT Platform",
    template: "%s | Ecosystem 4.0"
  },
  description: "Join the environmental revolution and earn NFT rewards for your conservation contributions",
  keywords: ["environment", "NFT", "blockchain", "conservation", "sustainability", "eco-friendly", "carbon credit", "green initiative"],
  generator: 'Next.js',
  applicationName: 'Ecosystem 4.0',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ecosystem4.0.example.com'),
  openGraph: {
    title: "Ecosystem 4.0 - Environmental NFT Platform",
    description: "Join the environmental revolution and earn NFT rewards for your conservation contributions",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ecosystem4.0.example.com',
    siteName: "Ecosystem 4.0",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ecosystem 4.0 - Environmental NFT Platform",
    description: "Join the environmental revolution and earn NFT rewards for your conservation contributions",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={inter.variable} // Add font variable
    >
      <head>
        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/your-critical-font.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
          storageKey="ecosystem4-theme"
        >
          <AuthProvider>
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
              <Header />
              <main className="flex-1">
                {children}
                <SpeedInsights />
                <Analytics />
              </main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}