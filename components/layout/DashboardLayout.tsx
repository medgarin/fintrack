import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-gray-100/40 md:block dark:bg-gray-800/40">
                <Sidebar />
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-black-400 px-6 dark:bg-gray-800/40 lg:h-[60px]">
                    <MobileNav />
                    <div className="w-full flex-1">
                        {/* Add search or breadcrumbs here if needed */}
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
