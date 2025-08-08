"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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
import { CalendarIcon, List, Upload } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { NewVehicleDocument } from "@/lib/db/schema"

const documentTypes = [
  "Insurance", "Registration", "Fitness Certificate", "Permit", "Tax Token", "Pollution Certificate"
]

export default function VehicleDocumentUploadPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    vehicleId: '',
    renewalFor: '',
    issueDate: undefined as Date | undefined,
    expiryDate: undefined as Date | undefined,
    remark: '',
  })

  // Fetch vehicles for dropdown
  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await fetch('/api/vehicles')
      if (!response.ok) throw new Error('Failed to fetch vehicles')
      return response.json()
    },
  })

  const createDocumentMutation = useMutation({
    mutationFn: async (document: NewVehicleDocument) => {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(document),
      })
      if (!response.ok) throw new Error('Failed to create document')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      router.push('/vehicles/documents')
    },
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleSave = () => {
    if (!formData.vehicleId || !formData.renewalFor) {
      alert('Please fill in required fields')
      return
    }

    const selectedVehicle = vehicles.find((v: any) => v.id.toString() === formData.vehicleId)
    
    const documentData: NewVehicleDocument = {
      vehicleId: parseInt(formData.vehicleId),
      documentType: formData.renewalFor,
      documentName: `${formData.renewalFor} - ${selectedVehicle?.registrationNumber || 'Unknown'}`,
      documentUrl: selectedFile ? `/uploads/${selectedFile.name}` : undefined,
      expiryDate: formData.expiryDate ? formData.expiryDate.toISOString().split('T')[0] : undefined,
    }

    createDocumentMutation.mutate(documentData)
  }

  const handleReset = () => {
    setFormData({
      vehicleId: '',
      renewalFor: '',
      issueDate: undefined,
      expiryDate: undefined,
      remark: '',
    })
    setSelectedFile(null)
  }

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Vehicle Renewals</h1>
        <Button 
          onClick={() => router.push('/vehicles/documents')}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <List className="h-4 w-4 mr-2" />
          Documents List
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-card border-2 border-primary/20 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vehicle No. */}
            <div className="space-y-2">
              <Label htmlFor="vehicleNo" className="text-sm font-medium">
                Vehicle No. *
              </Label>
              <Select
                value={formData.vehicleId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle: any) => (
                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                      {vehicle.registrationNumber} - {vehicle.manufacturer} {vehicle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Renewal For */}
            <div className="space-y-2">
              <Label htmlFor="renewalFor" className="text-sm font-medium">
                Renewal For *
              </Label>
              <Select
                value={formData.renewalFor}
                onValueChange={(value) => setFormData(prev => ({ ...prev, renewalFor: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Document Type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Document */}
            <div className="space-y-2">
              <Label htmlFor="document" className="text-sm font-medium">
                Select Document
              </Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Browse...
                </Button>
                <span className="text-sm text-muted-foreground flex-1">
                  {selectedFile ? selectedFile.name : 'No file selected.'}
                </span>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </div>
            </div>

            {/* Issue Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Issue Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.issueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.issueDate ? (
                      format(formData.issueDate, "dd-MM-yyyy")
                    ) : (
                      <span>dd-mm-yyyy</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.issueDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, issueDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? (
                      format(formData.expiryDate, "dd-MM-yyyy")
                    ) : (
                      <span>dd-mm-yyyy</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expiryDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, expiryDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Remark */}
            <div className="space-y-2">
              <Label htmlFor="remark" className="text-sm font-medium">
                Remark
              </Label>
              <Textarea
                id="remark"
                placeholder="Enter Remark"
                value={formData.remark}
                onChange={(e) => setFormData(prev => ({ ...prev, remark: e.target.value }))}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8 justify-center">
            <Button 
              onClick={handleSave}
              disabled={createDocumentMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              {createDocumentMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              variant="outline"
              onClick={handleReset}
              className="px-8"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
