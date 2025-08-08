import { NextRequest, NextResponse } from 'next/server'
import { getVehicles, createVehicle } from '@/lib/queries/vehicles'
import type { NewVehicle } from '@/lib/db/schema'

export async function GET() {
  try {
    const vehicles = await getVehicles()
    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Ensure required fields are present
    if (!body.registrationNumber || !body.manufacturer || !body.model || !body.vehicleType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const vehicle = await createVehicle(body as NewVehicle)
    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 })
  }
}
