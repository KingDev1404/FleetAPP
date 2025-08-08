import { pgTable, serial, varchar, integer, timestamp, boolean, text, date } from 'drizzle-orm/pg-core'

export const vehicles = pgTable('vehicles', {
  id: serial('id').primaryKey(),
  registrationNumber: varchar('registration_number', { length: 50 }).notNull(),
  manufacturer: varchar('manufacturer', { length: 50 }).notNull(),
  model: varchar('model', { length: 50 }).notNull(),
  year: integer('year').notNull(),
  vehicleType: varchar('vehicle_type', { length: 30 }).notNull(),
  fuelType: varchar('fuel_type', { length: 20 }),
  capacity: varchar('capacity', { length: 50 }),
  owner: varchar('owner', { length: 50 }),
  fleetManager: varchar('fleet_manager', { length: 50 }),
  insuranceExpiry: date('insurance_expiry'),
  registrationExpiry: date('registration_expiry'),
  remark: text('remark'),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  location: varchar('location', { length: 100 }),
  fuelLevel: integer('fuel_level').default(100),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const vehicleDocuments = pgTable('vehicle_documents', {
  id: serial('id').primaryKey(),
  vehicleId: integer('vehicle_id').references(() => vehicles.id),
  documentType: varchar('document_type', { length: 50 }).notNull(),
  documentName: varchar('document_name', { length: 100 }).notNull(),
  documentUrl: varchar('document_url', { length: 255 }),
  expiryDate: date('expiry_date'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
})

export type Vehicle = typeof vehicles.$inferSelect
export type NewVehicle = typeof vehicles.$inferInsert
export type VehicleDocument = typeof vehicleDocuments.$inferSelect
export type NewVehicleDocument = typeof vehicleDocuments.$inferInsert
