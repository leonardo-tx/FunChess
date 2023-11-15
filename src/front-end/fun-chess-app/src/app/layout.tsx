import './globals.css'
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import Layout from '../lib/base/components/Layout'
import Providers from '@/lib/base/components/Providers'

const inter = Inter({ subsets: ['latin'], weight: ["400", "500", "600", "700", "800"] })

export const metadata: Metadata = {
    title: 'aaaaaa',
}

export default function RootLayout({
  children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-br">
            <body className={inter.className}>
                <Providers>
                    <Layout>{children}</Layout>
                </Providers>
            </body>
        </html>
    );
}
