// This file contains the real database queries for when you're ready to use a real database
import { getDb } from '@/lib/db/setup'
import { vehicles, type Vehicle, type NewVehicle } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getVehiclesFromDb(): Promise<Vehicle[]> {
  const db = getDb()
  if (!db) {
    throw new Error('Database not available')
  }
  return await db.select().from(vehicles)
}

export async function getVehicleByIdFromDb(id: number): Promise<Vehicle | undefined> {
  const db = getDb()
  if (!db) {
    throw new Error('Database not available')
  }
  const result = await db.select().from(vehicles).where(eq(vehicles.id, id))
  return result[0]
}

export async function createVehicleInDb(vehicle: NewVehicle): Promise<Vehicle> {
  const db = getDb()
  if (!db) {
    throw new Error('Database not available')
  }
  const result = await db.insert(vehicles).values(vehicle).returning()
  return result[0]
}

export async function updateVehicleInDb(id: number, updates: Partial<NewVehicle>): Promise<Vehicle> {
  const db = getDb()
  if (!db) {
    throw new Error('Database not available')
  }
  const result = await db.update(vehicles).set(updates).where(eq(vehicles.id, id)).returning()
  return result[0]
}

export async function deleteVehicleFromDb(id: number): Promise<void> {
  const db = getDb()
  if (!db) {
    throw new Error('Database not available')
  }
  await db.delete(vehicles).where(eq(vehicles.id, id))
}
