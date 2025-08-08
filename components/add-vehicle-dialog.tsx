"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'

export function AddVehicleDialog() {
  const router = useRouter()

  return (
    <Button 
      onClick={() => router.push('/vehicles/add')}
      className="bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Vehicle
    </Button>
  )
}
