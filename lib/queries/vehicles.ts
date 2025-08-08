import { mockDb } from '@/lib/db'
import type { Vehicle, NewVehicle } from '@/lib/db/schema'

export async function getVehicles(): Promise<Vehicle[]> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockDb.vehicles
}

export async function getVehicleById(id: number): Promise<Vehicle | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockDb.vehicles.find(v => v.id === id)
}

export async function createVehicle(vehicle: NewVehicle): Promise<Vehicle> {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const newVehicle: Vehicle = {
    ...vehicle,
    id: mockDb.vehicles.length > 0 ? Math.max(...mockDb.vehicles.map(v => v.id)) + 1 : 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  mockDb.vehicles.push(newVehicle)
  mockDb.saveVehicles() // Save to localStorage
  return newVehicle
}

export async function updateVehicle(id: number, updates: Partial<NewVehicle>): Promise<Vehicle> {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const index = mockDb.vehicles.findIndex(v => v.id === id)
  if (index === -1) {
    throw new Error('Vehicle not found')
  }
  
  mockDb.vehicles[index] = {
    ...mockDb.vehicles[index],
    ...updates,
    updatedAt: new Date(),
  }
  
  mockDb.saveVehicles() // Save to localStorage
  return mockDb.vehicles[index]
}

export async function deleteVehicle(id: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const index = mockDb.vehicles.findIndex(v => v.id === id)
  if (index === -1) {
    throw new Error('Vehicle not found')
  }
  
  mockDb.vehicles.splice(index, 1)
  mockDb.saveVehicles() // Save to localStorage
}
