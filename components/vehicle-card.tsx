"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Fuel, Eye, Calendar, User } from 'lucide-react'
import { useRouter } from "next/navigation"
import type { Vehicle } from "@/lib/db/schema"

interface VehicleCardProps {
  vehicle: Vehicle
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const router = useRouter()
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border border-green-200'
      case 'maintenance':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
      case 'inactive':
        return 'bg-gray-50 text-gray-700 border border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
  }

  const getFuelColor = (level: number) => {
    if (level > 70) return 'text-green-600'
    if (level > 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleViewDetails = () => {
    router.push(`/vehicles/${vehicle.id}`)
  }

  return (
    <Card className="w-full bg-card border border-border hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{vehicle.registrationNumber || 'N/A'}</h3>
            <p className="text-sm text-muted-foreground">{vehicle.manufacturer || ''} {vehicle.model || ''}</p>
          </div>
          <Badge className={getStatusColor(vehicle.status || 'inactive')}>
            {vehicle.status || 'inactive'}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {vehicle.location || 'Unknown Location'}
          </div>
          <div className="flex items-center text-sm">
            <Fuel className={`h-4 w-4 mr-2 ${getFuelColor(vehicle.fuelLevel || 0)}`} />
            <span className={getFuelColor(vehicle.fuelLevel || 0)}>
              {vehicle.fuelLevel || 0}% Fuel
            </span>
          </div>
          {vehicle.fleetManager && (
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-2" />
              {vehicle.fleetManager}
            </div>
          )}
          {vehicle.capacity && (
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="font-medium mr-2">Capacity:</span>
              {vehicle.capacity}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
          <span>Year: {vehicle.year || 'N/A'}</span>
          <span>Type: {vehicle.vehicleType || 'N/A'}</span>
        </div>

        {(vehicle.insuranceExpiry || vehicle.registrationExpiry) && (
          <div className="mb-4 space-y-1">
            {vehicle.insuranceExpiry && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                Insurance: {new Date(vehicle.insuranceExpiry).toLocaleDateString()}
              </div>
            )}
            {vehicle.registrationExpiry && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                Registration: {new Date(vehicle.registrationExpiry).toLocaleDateString()}
              </div>
            )}
          </div>
        )}

        <Button 
          variant="outline" 
          className="w-full border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={handleViewDetails}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
