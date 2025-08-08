"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, MapPin, Fuel, Calendar, User, Settings, FileText, Car, Clock, Trash2 } from 'lucide-react'
import type { Vehicle } from "@/lib/db/schema"

export default function VehicleDetailsPage() {
  const params = useParams()
  const router = useRouter()
  
  // Parse the vehicle ID and validate it
  const vehicleId = parseInt(params.id as string)
  
  // If the ID is not a valid number, redirect to vehicles list
  if (isNaN(vehicleId)) {
    router.replace('/vehicles')
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Redirecting...</div>
      </div>
    )
  }

  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: async () => {
      const response = await fetch(`/api/vehicles/${vehicleId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch vehicle')
      }
      return response.json()
    },
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border border-gray-200'
      default:
        return 'bg-blue-100 text-blue-800 border border-blue-200'
    }
  }

  const getFuelColor = (level: number) => {
    if (level > 70) return 'text-green-600'
    if (level > 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading vehicle details...</div>
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-lg text-red-600 mb-4">Vehicle not found</div>
        <Button onClick={() => router.push('/vehicles')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vehicles
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 bg-background min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => router.push('/vehicles')}
            className="border-2 border-primary/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{vehicle.registrationNumber}</h1>
            <p className="text-muted-foreground">{vehicle.manufacturer} {vehicle.model} ({vehicle.year})</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className={`${getStatusColor(vehicle.status || 'active')} px-3 py-1 text-sm font-medium`}>
            {vehicle.status || 'active'}
          </Badge>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Edit className="h-4 w-4 mr-2" />
            Edit Vehicle
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Location</p>
                <p className="text-lg font-semibold text-foreground">{vehicle.location || 'Fleet Depot'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Fuel className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fuel Level</p>
                <p className={`text-lg font-semibold ${getFuelColor(vehicle.fuelLevel || 0)}`}>
                  {vehicle.fuelLevel || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mileage</p>
                <p className="text-lg font-semibold text-foreground">0 km</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Update</p>
                <p className="text-lg font-semibold text-foreground">
                  {vehicle.updatedAt ? new Date(vehicle.updatedAt).toLocaleDateString('en-GB') : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vehicle Information */}
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Vehicle Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Registration Number:</span>
                    <span className="font-medium text-foreground">{vehicle.registrationNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Manufacturer:</span>
                    <span className="font-medium text-foreground">{vehicle.manufacturer || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Model:</span>
                    <span className="font-medium text-foreground">{vehicle.model || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Year:</span>
                    <span className="font-medium text-foreground">{vehicle.year || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Vehicle Type:</span>
                    <span className="font-medium text-foreground">{vehicle.vehicleType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">VIN:</span>
                    <span className="font-medium text-foreground">VIN{vehicle.id}75448{vehicle.year || '2025'}354</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Fuel Type:</span>
                    <span className="font-medium text-foreground">{vehicle.fuelType || 'Diesel'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Capacity:</span>
                    <span className="font-medium text-foreground">{vehicle.capacity || '1000'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Management Details */}
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Management Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Owner:</span>
                    <span className="font-medium text-foreground">{vehicle.owner || 'Own'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Fleet Manager:</span>
                    <span className="font-medium text-foreground">{vehicle.fleetManager || 'Mike Davis'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Insurance Expiry:</span>
                    <span className="font-medium text-foreground">
                      {vehicle.insuranceExpiry ? new Date(vehicle.insuranceExpiry).toLocaleDateString('en-GB') : '30/08/2025'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Registration Expiry:</span>
                    <span className="font-medium text-foreground">
                      {vehicle.registrationExpiry ? new Date(vehicle.registrationExpiry).toLocaleDateString('en-GB') : '01/08/2025'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Added On:</span>
                    <span className="font-medium text-foreground">
                      {vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString('en-GB') : '06/08/2025'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={`${getStatusColor(vehicle.status || 'active')} text-xs px-2 py-1`}>
                      {vehicle.status || 'active'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          {vehicle.remark && (
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Additional Information</h3>
                <p className="text-muted-foreground">{vehicle.remark}</p>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline"
                  onClick={() => router.push('/vehicles/documents')}
                  className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Documents
                </Button>
                <Button 
                  variant="outline"
                  className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
                <Button 
                  variant="outline"
                  className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Track Location
                </Button>
                <Button 
                  variant="outline"
                  className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Fuel className="h-4 w-4 mr-2" />
                  Fuel History
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center py-12">
                <div className="mb-4 p-4 bg-muted/50 rounded-full w-fit mx-auto">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Vehicle Documents</h3>
                <p className="text-muted-foreground mb-6">
                  Manage documents for {vehicle.registrationNumber}
                </p>
                <Button 
                  onClick={() => router.push('/vehicles/documents')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View All Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
