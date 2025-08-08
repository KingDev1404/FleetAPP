"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Clock, History, Car, List, Plus, FileText, BarChart3, TrendingUp, Shield, Fuel, AlertTriangle, Briefcase, Package, Calendar, Wrench, FileBarChart, Phone, User, ChevronDown, ChevronRight } from 'lucide-react'

const navigation = [
  { name: "Realtime", href: "/realtime", icon: Clock },
  { name: "History", href: "/history", icon: History },
  {
    name: "Vehicles",
    href: "/vehicles",
    icon: Car,
    children: [
      { name: "Vehicle List", href: "/vehicles", icon: List },
      { name: "Add Vehicle", href: "/vehicles/add", icon: Plus },
      { name: "Vehicle Documents", href: "/vehicles/documents", icon: FileText },
    ],
  },
  { name: "Overview", href: "/overview", icon: BarChart3 },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Safety", href: "/safety", icon: Shield },
  { name: "Fuel", href: "/fuel", icon: Fuel },
  { name: "Alarms", href: "/alarms", icon: AlertTriangle },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Shipments", href: "/shipments", icon: Package },
  { name: "Planning", href: "/planning", icon: Calendar },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "Reports", href: "/reports", icon: FileBarChart },
  { name: "Call", href: "/call", icon: Phone },
  { name: "Account", href: "/account", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(["Vehicles"])

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    )
  }

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar/20">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-foreground/10">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold">
            P
          </div>
          <span className="text-xl font-semibold text-sidebar-foreground">Pikup</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isExpanded = expandedItems.includes(item.name)
          const isActive = pathname === item.href || 
            (item.children && item.children.some(child => {
              if (child.href === "/vehicles") {
                return pathname === "/vehicles" || /^\/vehicles\/\d+$/.test(pathname)
              }
              return pathname === child.href || pathname.startsWith(child.href + '/')
            }))
          
          return (
            <div key={item.name}>
              <div className="flex items-center">
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-1 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
                {item.children && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-foreground/10"
                    onClick={() => toggleExpanded(item.name)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              {item.children && isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        (pathname === child.href || 
                         (child.href === "/vehicles" && /^\/vehicles\/\d+$/.test(pathname)) ||
                         (child.href !== "/vehicles" && pathname.startsWith(child.href + '/')))
                          ? "bg-primary/20 text-primary border-l-2 border-primary"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"
                      )}
                    >
                      <child.icon className="mr-3 h-4 w-4" />
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}
