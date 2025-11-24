import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { createClient } from '@/utils/supabase/server'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { MonthlyClosureCheck } from '@/components/dashboard/MonthlyClosureCheck'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[250px_1fr] lg:grid-cols-[280px_1fr] bg-background">
            <div className="hidden border-r border-border/40 bg-sidebar md:block h-screen sticky top-0">
                <Sidebar user={user} />
            </div>
            <div className="flex flex-col relative">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(0deg,transparent,black)] -z-10" />

                {/* ... inside DashboardLayout */}
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-background/80 px-6 backdrop-blur-md transition-all">
                    <MobileNav user={user} />
                    <div className="w-full flex-1 flex items-center justify-between">
                        <Breadcrumbs />
                        {/* Add search or user menu here if needed */}
                    </div>
                </header>
                <MonthlyClosureCheck />
                <main className="flex flex-1 flex-col gap-6 p-6 lg:gap-8 lg:p-8 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    )
}
