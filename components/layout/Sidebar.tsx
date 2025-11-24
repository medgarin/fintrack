'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Wallet, CreditCard, PiggyBank, LogOut, DollarSign, User, PieChart, TrendingUp } from 'lucide-react'
import { signout } from '@/app/login/actions'
import { User as SupabaseUser } from '@supabase/supabase-js'

const sidebarItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Presupuesto', href: '/budget', icon: PieChart },
    { name: 'Ingresos', href: '/incomes', icon: TrendingUp },
    { name: 'Gastos', href: '/expenses', icon: CreditCard },
    { name: 'Ahorros', href: '/savings', icon: PiggyBank },
]

interface SidebarProps {
    user?: SupabaseUser | null
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname()
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'
    const userEmail = user?.email || 'user@fintrack.com'
    const userInitial = userName.charAt(0).toUpperCase()

    return (
        <div className="flex flex-col h-full min-h-screen bg-sidebar text-sidebar-foreground">
            {/* Logo area with gradient */}
            <div className="flex h-16 items-center border-b border-sidebar-border px-6 bg-gradient-to-r from-primary/10 to-accent/10">
                <Link className="flex items-center gap-3 font-semibold group" href="/">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg transition-transform group-hover:scale-110">
                        <DollarSign className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Fintrack
                        </span>
                        <span className="text-xs text-muted-foreground">Finanzas Personales</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-3 text-sm font-medium gap-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all group",
                                    isActive
                                        ? "bg-gradient-to-r from-primary/20 to-accent/20 text-foreground font-semibold shadow-sm"
                                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                            >
                                {/* Active indicator bar */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-r-full" />
                                )}

                                <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                                    isActive
                                        ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md"
                                        : "bg-sidebar-accent/50 group-hover:bg-sidebar-accent group-hover:scale-110"
                                )}>
                                    <item.icon className="h-4 w-4" />
                                </div>

                                <span className="transition-transform group-hover:translate-x-0.5">
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* User section & Logout */}
            <div className="mt-auto border-t border-sidebar-border p-4 space-y-3">
                {/* User info */}
                <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-sidebar-accent/30 hover:bg-sidebar-accent/50 transition-colors">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold text-sm shadow-sm">
                        {userInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" title={userName}>{userName}</p>
                        <p className="text-xs text-muted-foreground truncate" title={userEmail}>{userEmail}</p>
                    </div>
                </div>

                {/* Logout button */}
                <form action={signout}>
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2 border-sidebar-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all group"
                    >
                        <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                        Cerrar Sesión
                    </Button>
                </form>
            </div>
        </div>
    )
}
