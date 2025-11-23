'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Wallet, CreditCard, PiggyBank, LogOut } from 'lucide-react'
import { signout } from '@/app/login/actions'

const sidebarItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Incomes', href: '/incomes', icon: Wallet },
    { name: 'Expenses', href: '/expenses', icon: CreditCard },
    { name: 'Savings', href: '/savings', icon: PiggyBank },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
            <div className="flex h-14 items-center border-b border-sidebar-border px-6">
                <Link className="flex items-center gap-2 font-semibold" href="/">
                    <span className="">Finance Dashboard</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                pathname === item.href
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-4">
                <form action={signout}>
                    <Button variant="outline" className="w-full justify-start gap-2 border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </form>
            </div>
        </div>
    )
}
