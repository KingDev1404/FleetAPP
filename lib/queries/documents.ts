import { mockDb } from '@/lib/db'
import type { VehicleDocument, NewVehicleDocument } from '@/lib/db/schema'

export async function getDocuments(): Promise<VehicleDocument[]> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockDb.vehicleDocuments
}

export async function getDocumentById(id: number): Promise<VehicleDocument | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockDb.vehicleDocuments.find(d => d.id === id)
}

export async function getDocumentsByVehicleId(vehicleId: number): Promise<VehicleDocument[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockDb.vehicleDocuments.filter(d => d.vehicleId === vehicleId)
}

export async function createDocument(document: NewVehicleDocument): Promise<VehicleDocument> {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const newDocument: VehicleDocument = {
    ...document,
    id: mockDb.vehicleDocuments.length > 0 ? Math.max(...mockDb.vehicleDocuments.map(d => d.id)) + 1 : 1,
    uploadedAt: new Date(),
  }
  
  mockDb.vehicleDocuments.push(newDocument)
  mockDb.saveDocuments() // Save to localStorage
  return newDocument
}

export async function updateDocument(id: number, updates: Partial<NewVehicleDocument>): Promise<VehicleDocument> {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const index = mockDb.vehicleDocuments.findIndex(d => d.id === id)
  if (index === -1) {
    throw new Error('Document not found')
  }
  
  mockDb.vehicleDocuments[index] = {
    ...mockDb.vehicleDocuments[index],
    ...updates,
  }
  
  mockDb.saveDocuments() // Save to localStorage
  return mockDb.vehicleDocuments[index]
}

export async function deleteDocument(id: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const index = mockDb.vehicleDocuments.findIndex(d => d.id === id)
  if (index === -1) {
    throw new Error('Document not found')
  }
  
  mockDb.vehicleDocuments.splice(index, 1)
  mockDb.saveDocuments() // Save to localStorage
}
