"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, List } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { NewVehicle } from "@/lib/db/schema"

const manufacturers = [
  "Ford", "Mercedes", "Chevrolet", "Isuzu", "Toyota", "Nissan", "Volvo", "Scania", "MAN", "DAF"
]

const vehicleTypes = [
  "Van", "Truck", "Car", "Motorcycle", "Bus", "Trailer", "Semi-Truck"
]

const fuelTypes = [
  "Petrol", "Diesel", "Electric", "Hybrid", "CNG", "LPG"
]

const owners = [
  "Own", "Leased", "Rented"
]

const fleetManagers = [
  "John Smith", "Sarah Johnson", "Mike Wilson", "Emily Davis", "Robert Brown"
]

export default function AddVehiclePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState<Partial<NewVehicle>>({
    registrationNumber: '',
    manufacturer: '',
    model: '',
    year: new Date().getFullYear(),
    vehicleType: '',
    fuelType: '',
    capacity: '',
    owner: '',
    fleetManager: '',
    insuranceExpiry: undefined,
    registrationExpiry: undefined,
    remark: '',
    status: 'active',
    fuelLevel: 100,
  })

  const addVehicleMutation = useMutation({
    mutationFn: async (vehicle: NewVehicle) => {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicle),
      })
      if (!response.ok) throw new Error('Failed to add vehicle')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      router.push('/vehicles')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.registrationNumber && formData.manufacturer && formData.model && formData.vehicleType) {
      addVehicleMutation.mutate(formData as NewVehicle)
    }
  }

  const handleClearForm = () => {
    setFormData({
      registrationNumber: '',
      manufacturer: '',
      model: '',
      year: new Date().getFullYear(),
      vehicleType: '',
      fuelType: '',
      capacity: '',
      owner: '',
      fleetManager: '',
      insuranceExpiry: undefined,
      registrationExpiry: undefined,
      remark: '',
      status: 'active',
      fuelLevel: 100,
    })
  }

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Add Vehicle</h1>
        <Button 
          onClick={() => router.push('/vehicles')}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <List className="h-4 w-4 mr-2" />
          Vehicle List
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-card border-2 border-primary rounded-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Registration Number */}
              <div className="space-y-2">
                <Label htmlFor="registrationNumber" className="text-sm font-medium text-foreground">
                  Registration Number *
                </Label>
                <Input
                  id="registrationNumber"
                  placeholder="Enter Registration Number"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              {/* Manufacturer */}
              <div className="space-y-2">
                <Label htmlFor="manufacturer" className="text-sm font-medium text-foreground">
                  Manufacturer *
                </Label>
                <Select
                  value={formData.manufacturer}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, manufacturer: value }))}
                >
                  <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Select Manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {manufacturers.map((manufacturer) => (
                      <SelectItem key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Model */}
              <div className="space-y-2">
                <Label htmlFor="model" className="text-sm font-medium text-foreground">
                  Model *
                </Label>
                <Input
                  id="model"
                  placeholder="Enter Model"
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label htmlFor="year" className="text-sm font-medium text-foreground">
                  Year *
                </Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              {/* Vehicle Type */}
              <div className="space-y-2">
                <Label htmlFor="vehicleType" className="text-sm font-medium text-foreground">
                  Vehicle Type *
                </Label>
                <Select
                  value={formData.vehicleType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleType: value }))}
                >
                  <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Select Vehicle Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fuel Type */}
              <div className="space-y-2">
                <Label htmlFor="fuelType" className="text-sm font-medium text-foreground">
                  Fuel Type
                </Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, fuelType: value }))}
                >
                  <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Select Fuel Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-sm font-medium text-foreground">
                  Capacity
                </Label>
                <Input
                  id="capacity"
                  placeholder="e.g., 3.5 tons, 2000 kg"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                  className="border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>

              {/* Owner */}
              <div className="space-y-2">
                <Label htmlFor="owner" className="text-sm font-medium text-foreground">
                  Owner
                </Label>
                <Select
                  value={formData.owner}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, owner: value }))}
                >
                  <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Select Owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((owner) => (
                      <SelectItem key={owner} value={owner}>
                        {owner}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fleet Manager */}
              <div className="space-y-2">
                <Label htmlFor="fleetManager" className="text-sm font-medium text-foreground">
                  Fleet Manager
                </Label>
                <Select
                  value={formData.fleetManager}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, fleetManager: value }))}
                >
                  <SelectTrigger className="border-gray-300 focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Select Fleet Manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {fleetManagers.map((manager) => (
                      <SelectItem key={manager} value={manager}>
                        {manager}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Insurance Expiry */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Insurance Expiry</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-300 focus:border-primary focus:ring-primary",
                        !formData.insuranceExpiry && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.insuranceExpiry ? (
                        format(new Date(formData.insuranceExpiry), "dd-MM-yyyy")
                      ) : (
                        <span>dd-mm-yyyy</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.insuranceExpiry ? new Date(formData.insuranceExpiry) : undefined}
                      onSelect={(date) => setFormData(prev => ({ 
                        ...prev, 
                        insuranceExpiry: date ? date.toISOString().split('T')[0] : undefined 
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Registration Expiry */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Registration Expiry</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-300 focus:border-primary focus:ring-primary",
                        !formData.registrationExpiry && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.registrationExpiry ? (
                        format(new Date(formData.registrationExpiry), "dd-MM-yyyy")
                      ) : (
                        <span>dd-mm-yyyy</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.registrationExpiry ? new Date(formData.registrationExpiry) : undefined}
                      onSelect={(date) => setFormData(prev => ({ 
                        ...prev, 
                        registrationExpiry: date ? date.toISOString().split('T')[0] : undefined 
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Remark - Full Width */}
            <div className="mt-6 space-y-2">
              <Label htmlFor="remark" className="text-sm font-medium text-foreground">
                Remark
              </Label>
              <Textarea
                id="remark"
                placeholder="Enter any additional remarks or notes"
                value={formData.remark}
                onChange={(e) => setFormData(prev => ({ ...prev, remark: e.target.value }))}
                rows={4}
                className="border-gray-300 focus:border-primary focus:ring-primary resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-8 justify-center">
              <Button 
                type="submit" 
                disabled={addVehicleMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2"
              >
                {addVehicleMutation.isPending ? 'Saving...' : 'Save Vehicle'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={handleClearForm}
                className="px-8 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear Form
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
