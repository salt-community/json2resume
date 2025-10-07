/**
 * Blob-based file storage using IndexedDB for persistence
 * Stores actual File/Blob objects and converts to data URIs for export
 */

import type { ResumeImageData } from '@/types'

const DB_NAME = 'ResumeImageStorage'
const DB_VERSION = 1
const STORE_NAME = 'images'

let db: IDBDatabase | null = null

// Initialize IndexedDB
async function initDB(): Promise<IDBDatabase> {
  if (db) return db
  
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }
    
    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

/**
 * Store a File object and return ResumeImageData
 */
export async function storeImageFile(file: File): Promise<ResumeImageData> {
  const objectUrl = URL.createObjectURL(file)
  const fileId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  // Store the actual File object in IndexedDB
  const database = await initDB()
  const transaction = database.transaction([STORE_NAME], 'readwrite')
  const store = transaction.objectStore(STORE_NAME)
  
  await new Promise<void>((resolve, reject) => {
    const request = store.put({
      id: fileId,
      file: file,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      createdAt: Date.now()
    })
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
  
  return {
    objectUrl,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type
  }
}

/**
 * Get blob data URI for export (converts blob to data URI)
 */
export async function getImageDataUri(imageData: ResumeImageData): Promise<string | null> {
  try {
    // Extract fileId from objectUrl (this is a bit hacky but works for this demo)
    const fileId = imageData.objectUrl.split('/').pop()
    if (!fileId) return null
    
    const database = await initDB()
    const transaction = database.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    return new Promise((resolve, reject) => {
      const request = store.get(fileId)
      request.onsuccess = () => {
        const result = request.result
        if (result?.file) {
          // Convert File to data URI
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(result.file)
        } else {
          resolve(null)
        }
      }
      request.onerror = () => reject(request.error)
    })
  } catch {
    return null
  }
}

/**
 * Restore ResumeImageData from stored blob
 */
export async function restoreImageData(imageData: ResumeImageData): Promise<ResumeImageData | null> {
  try {
    const fileId = imageData.objectUrl.split('/').pop()
    if (!fileId) return null
    
    const database = await initDB()
    const transaction = database.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    return new Promise((resolve, reject) => {
      const request = store.get(fileId)
      request.onsuccess = () => {
        const result = request.result
        if (result?.file) {
          // Create new Object URL from stored File
          const newObjectUrl = URL.createObjectURL(result.file)
          resolve({
            objectUrl: newObjectUrl,
            fileName: result.fileName,
            fileSize: result.fileSize,
            mimeType: result.mimeType
          })
        } else {
          resolve(null)
        }
      }
      request.onerror = () => reject(request.error)
    })
  } catch {
    return null
  }
}

/**
 * Clean up Object URL and remove from storage
 */
export async function cleanupImageData(imageData: ResumeImageData): Promise<void> {
  URL.revokeObjectURL(imageData.objectUrl)
  
  try {
    const fileId = imageData.objectUrl.split('/').pop()
    if (!fileId) return
    
    const database = await initDB()
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(fileId)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch {
    // Ignore cleanup errors
  }
}
