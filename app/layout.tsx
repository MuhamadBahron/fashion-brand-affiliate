import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter' 
})

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'], 
  variable: '--font-poppins' 
})

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'MODENA | Digital Fashion Brand',
  description: 'Tampil beda dengan koleksi streetwear, Korean style, dan old money outfit.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}