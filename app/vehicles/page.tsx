"use client"

import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Search, Car } from 'lucide-react'
import { VehicleCard } from "@/components/vehicle-card"
import { AddVehicleDialog } from "@/components/add-vehicle-dialog"
import type { Vehicle } from "@/lib/db/schema"
import { useState } from "react"

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const { data: vehicles = [], isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await fetch('/api/vehicles')
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles')
      }
      return response.json()
    },
  })

  const filteredVehicles = vehicles.filter((vehicle: Vehicle) =>
    (vehicle.registrationNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (vehicle.manufacturer?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (vehicle.model?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (vehicle.vehicleType?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading vehicles...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-red-600">Error loading vehicles. Please try again.</div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Vehicles</h1>
        <p className="text-muted-foreground">Manage your fleet vehicles</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Vehicles</h2>
            <p className="text-muted-foreground">
              Manage your fleet vehicles ({filteredVehicles.length} total)
            </p>
          </div>
          <AddVehicleDialog />
        </div>

        {vehicles.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border focus:ring-primary focus:border-primary"
            />
          </div>
        )}
      </div>

      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 p-4 bg-muted/50 rounded-full">
            <Car className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No vehicles yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Get started by adding your first vehicle to the fleet management system.
          </p>
          <AddVehicleDialog />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle: Vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
              />
            ))}
          </div>

          {filteredVehicles.length === 0 && vehicles.length > 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No vehicles found matching your search.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
