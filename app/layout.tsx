import { ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
 } from '@clerk/nextjs'

import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Image Background Remover',
  description: 'Remove backgrounds from images with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
       <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-gray-50 text-gray-800 min-h-screen`}>
          <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800">Image Background Remover</h1>
            <div>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200",
                      userButtonPopoverCard: "bg-white border border-gray-200 shadow-lg",
                      userButtonPopoverActionButton: "hover:bg-gray-100",
                      userButtonPopoverActionButtonText: "text-gray-800",
                      userButtonPopoverFooter: "hidden",
                    }
                  }}
                />
              </SignedIn>
            </div>
          </header>
          <main className="bg-gray-50">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
   )
}
