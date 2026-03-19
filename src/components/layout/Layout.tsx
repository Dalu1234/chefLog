import type { ReactNode } from 'react'
import { DesktopSidebar, MobileHeader } from './Sidebar'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-surface-100">
      <DesktopSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
        <MobileHeader />
        <main className="flex-1 px-6 md:px-8 py-6 md:py-8 max-w-[1100px] w-full animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
