'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { Fragment } from 'react'

export function Breadcrumbs() {
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean)

    const breadcrumbs = [
        { name: 'Dashboard', href: '/' },
        ...segments.map((segment, index) => {
            const href = `/${segments.slice(0, index + 1).join('/')}`
            const name = segment.charAt(0).toUpperCase() + segment.slice(1)
            return { name, href }
        })
    ]

    return (
        <nav className="flex items-center text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1

                return (
                    <Fragment key={crumb.href}>
                        {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
                        {index === 0 ? (
                            <Link
                                href={crumb.href}
                                className="flex items-center hover:text-foreground transition-colors"
                            >
                                <Home className="h-4 w-4 mr-1" />
                                <span className="sr-only">Home</span>
                            </Link>
                        ) : isLast ? (
                            <span className="font-medium text-foreground">{crumb.name}</span>
                        ) : (
                            <Link
                                href={crumb.href}
                                className="hover:text-foreground transition-colors"
                            >
                                {crumb.name}
                            </Link>
                        )}
                    </Fragment>
                )
            })}
        </nav>
    )
}
