'use client'

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { LayoutDashboard, PieChart, TrendingUp } from 'lucide-react' // Added imports for icons

// Define navigation links here, as they are likely used by Sidebar
const navLinks = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Presupuesto', href: '/budget', icon: PieChart },
    { name: 'Ingresos', href: '/incomes', icon: TrendingUp },
]

interface MobileNavProps {
    user?: SupabaseUser | null
}

export function MobileNav({ user }: MobileNavProps) {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden hover:bg-accent/10 hover:text-accent transition-colors"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r border-border/40 w-[280px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <Sidebar user={user} />
            </SheetContent>
        </Sheet>
    )
}
