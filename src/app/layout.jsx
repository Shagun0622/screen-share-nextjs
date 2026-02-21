import { Bebas_Neue, Outfit, Fira_Code } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-playfair',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = {
  title: 'Screen Share Test App',
  description: 'Verify browser screen-sharing capabilities, test permission flows, and inspect live stream metadata.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${outfit.variable} ${firaCode.variable}`}>
      <body>{children}</body>
    </html>
  )
}
