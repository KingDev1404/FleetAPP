"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Upload, Eye, Download, FileText, AlertTriangle, Clock, CheckCircle, Filter } from 'lucide-react'

const documentTypes = [
  "Registration", "Insurance", "Fitness Certificate", "Permit", "Tax Token", "Pollution Certificate"
]

export default function VehicleDocumentsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Fetch documents from API
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await fetch('/api/documents')
      if (!response.ok) throw new Error('Failed to fetch documents')
      return response.json()
    },
  })

  // Fetch vehicles to get vehicle details
  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await fetch('/api/vehicles')
      if (!response.ok) throw new Error('Failed to fetch vehicles')
      return response.json()
    },
  })

  // Enhance documents with vehicle information and status calculation
  const enhancedDocuments = documents.map((doc: any) => {
    const vehicle = vehicles.find((v: any) => v.id === doc.vehicleId)
    const today = new Date()
    const expiryDate = doc.expiryDate ? new Date(doc.expiryDate) : null
    
    let status = 'active'
    let daysUntilExpiry = 0
    
    if (expiryDate) {
      daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysUntilExpiry < 0) {
        status = 'expired'
      } else if (daysUntilExpiry <= 30) {
        status = 'expiring'
      } else {
        status = 'active'
      }
    }
    
    return {
      ...doc,
      vehiclePlate: vehicle?.registrationNumber || 'Unknown',
      status,
      daysUntilExpiry,
      uploadedBy: 'System User', // Default for now
    }
  })

  // Calculate summary statistics
  const totalDocuments = enhancedDocuments.length
  const validDocuments = enhancedDocuments.filter(doc => doc.status === 'active').length
  const expiringDocuments = enhancedDocuments.filter(doc => doc.status === 'expiring').length
  const expiredDocuments = enhancedDocuments.filter(doc => doc.status === 'expired').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'expiring':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'expiring':
        return <Clock className="h-4 w-4" />
      case 'expired':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getExpiryText = (document: any) => {
    if (document.status === 'expired') {
      return `Expired ${Math.abs(document.daysUntilExpiry)} days ago`
    } else if (document.status === 'expiring') {
      return `Expires in ${document.daysUntilExpiry} days`
    }
    return null
  }

  const filteredDocuments = enhancedDocuments.filter(doc => {
    const matchesSearch = doc.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || doc.documentType === filterType
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const handleUploadDocument = () => {
    router.push('/vehicles/documents/upload')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading documents...</div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Vehicle Documents</h1>
        <p className="text-muted-foreground">Manage all vehicle-related documents and certificates</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold text-foreground">{totalDocuments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valid Documents</p>
                <p className="text-2xl font-bold text-foreground">{validDocuments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-foreground">{expiringDocuments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expired Documents</p>
                <p className="text-2xl font-bold text-foreground">{expiredDocuments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by vehicle, document name, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {documentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expiring">Expiring Soon</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={handleUploadDocument}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 p-4 bg-muted/50 rounded-full">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No documents found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchTerm || filterType !== "all" || filterStatus !== "all" 
                ? "No documents match your current filters."
                : "Start by uploading vehicle documents to track and manage them."
              }
            </p>
            <Button 
              onClick={handleUploadDocument}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload First Document
            </Button>
          </div>
        ) : (
          filteredDocuments.map((document) => (
            <Card key={document.id} className="border border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Document Icon */}
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    
                    {/* Document Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {document.documentName}
                        </h3>
                        <Badge className={`${getStatusColor(document.status)} text-xs px-2 py-1`}>
                          {document.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                        <div>
                          <span className="font-medium">Vehicle:</span> {document.vehiclePlate}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {document.documentType}
                        </div>
                        <div>
                          <span className="font-medium">Issue Date:</span> {document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Expiry Date:</span> {document.expiryDate ? new Date(document.expiryDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>

                      {/* Expiry Warning */}
                      {getExpiryText(document) && (
                        <div className={`flex items-center space-x-2 text-sm ${
                          document.status === 'expired' ? 'text-red-600' : 'text-orange-600'
                        }`}>
                          {getStatusIcon(document.status)}
                          <span>{getExpiryText(document)}</span>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground mt-2">
                        Uploaded by {document.uploadedBy} on {document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
