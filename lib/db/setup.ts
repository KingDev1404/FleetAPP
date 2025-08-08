// This file contains the proper database setup for when you're ready to use a real database
// For now, we're using mock data to avoid connection issues

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Only create database connection when DATABASE_URL is available
export function createDbConnection() {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    console.warn('DATABASE_URL not found, using mock data')
    return null
  }

  try {
    const client = postgres(connectionString, {
      max: 1, // Limit connections in serverless environment
    })
    return drizzle(client, { schema })
  } catch (error) {
    console.error('Failed to create database connection:', error)
    return null
  }
}

// Export a function to get the database instance
export function getDb() {
  return createDbConnection()
}
