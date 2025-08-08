// Enhanced in-memory approach with localStorage persistence
// This ensures data persists across page refreshes

const STORAGE_KEYS = {
  VEHICLES: 'fleet_vehicles',
  VEHICLE_DOCUMENTS: 'fleet_vehicle_documents'
}

// Initialize data from localStorage or use empty arrays
const initializeData = () => {
  if (typeof window !== 'undefined') {
    const savedVehicles = localStorage.getItem(STORAGE_KEYS.VEHICLES)
    const savedDocuments = localStorage.getItem(STORAGE_KEYS.VEHICLE_DOCUMENTS)
    
    return {
      vehicles: savedVehicles ? JSON.parse(savedVehicles) : [],
      vehicleDocuments: savedDocuments ? JSON.parse(savedDocuments) : []
    }
  }
  
  return {
    vehicles: [],
    vehicleDocuments: []
  }
}

// Save data to localStorage
const saveToStorage = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

// Initialize the mock database
const initialData = initializeData()

export const mockDb = {
  vehicles: initialData.vehicles,
  vehicleDocuments: initialData.vehicleDocuments,
  
  // Helper methods to save data
  saveVehicles: () => saveToStorage(STORAGE_KEYS.VEHICLES, mockDb.vehicles),
  saveDocuments: () => saveToStorage(STORAGE_KEYS.VEHICLE_DOCUMENTS, mockDb.vehicleDocuments)
}
