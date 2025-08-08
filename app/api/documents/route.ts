import { NextRequest, NextResponse } from 'next/server'
import { getDocuments, createDocument } from '@/lib/queries/documents'
import type { NewVehicleDocument } from '@/lib/db/schema'

export async function GET() {
  try {
    const documents = await getDocuments()
    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Ensure required fields are present
    if (!body.vehicleId || !body.documentType || !body.documentName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const document = await createDocument(body as NewVehicleDocument)
    return NextResponse.json(document)
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}
