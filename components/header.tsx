"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Moon, Bell, Settings } from 'lucide-react'

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex-1" />
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
          <Moon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
          <Settings className="h-5 w-5" />
        </Button>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Sign In
        </Button>
      </div>
    </header>
  )
}
