import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Saturn's Rings - Interactive 3D Developer Tools",
  description: 'A realistic 3D visualization of Saturn with developer tool logos orbiting in its rings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black overflow-hidden m-0 p-0">
        {children}
      </body>
    </html>
  )
}