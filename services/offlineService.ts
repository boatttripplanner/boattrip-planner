// services/offlineService.ts
// Servicio para gestión de datos offline usando IndexedDB

interface OfflineForm {
  id: string;
  data: any;
  timestamp: number;
  synced: boolean;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  offlineMode: boolean;
  lastSync: number;
}

interface WeatherCache {
  location: string;
  data: any;
  timestamp: number;
  expires: number;
}

class OfflineService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'BoatTripOfflineDB';
  private readonly DB_VERSION = 1;

  // Inicializar la base de datos
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store para formularios offline
        if (!db.objectStoreNames.contains('offlineForms')) {
          const formStore = db.createObjectStore('offlineForms', { keyPath: 'id' });
          formStore.createIndex('timestamp', 'timestamp', { unique: false });
          formStore.createIndex('synced', 'synced', { unique: false });
        }

        // Store para preferencias de usuario
        if (!db.objectStoreNames.contains('userPreferences')) {
          const prefStore = db.createObjectStore('userPreferences', { keyPath: 'id' });
        }

        // Store para cache de weather
        if (!db.objectStoreNames.contains('weatherCache')) {
          const weatherStore = db.createObjectStore('weatherCache', { keyPath: 'location' });
          weatherStore.createIndex('expires', 'expires', { unique: false });
        }

        // Store para datos de barcos y puertos
        if (!db.objectStoreNames.contains('boatData')) {
          const boatStore = db.createObjectStore('boatData', { keyPath: 'type' });
        }

        // Store para historial de viajes
        if (!db.objectStoreNames.contains('tripHistory')) {
          const historyStore = db.createObjectStore('tripHistory', { keyPath: 'id', autoIncrement: true });
          historyStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Gestión de formularios offline
  async saveOfflineForm(formData: any): Promise<string> {
    const id = `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const form: OfflineForm = {
      id,
      data: formData,
      timestamp: Date.now(),
      synced: false
    };

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['offlineForms'], 'readwrite');
      const store = transaction.objectStore('offlineForms');
      const request = store.add(form);

      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }

  async getOfflineForms(): Promise<OfflineForm[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['offlineForms'], 'readonly');
      const store = transaction.objectStore('offlineForms');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getUnsyncedForms(): Promise<OfflineForm[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['offlineForms'], 'readonly');
      const store = transaction.objectStore('offlineForms');
      const request = store.getAll();

      request.onsuccess = () => {
        // Filtrar los formularios no sincronizados
        const unsyncedForms = request.result.filter((form: OfflineForm) => !form.synced);
        resolve(unsyncedForms);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async markFormAsSynced(formId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['offlineForms'], 'readwrite');
      const store = transaction.objectStore('offlineForms');
      const getRequest = store.get(formId);

      getRequest.onsuccess = () => {
        const form = getRequest.result;
        if (form) {
          form.synced = true;
          const putRequest = store.put(form);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Form not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async removeForm(formId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['offlineForms'], 'readwrite');
      const store = transaction.objectStore('offlineForms');
      const request = store.delete(formId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Gestión de preferencias de usuario
  async saveUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    const prefs: UserPreferences = {
      theme: 'auto',
      language: 'es',
      notifications: true,
      offlineMode: false,
      lastSync: Date.now(),
      ...preferences
    };

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['userPreferences'], 'readwrite');
      const store = transaction.objectStore('userPreferences');
      const request = store.put({ id: 'user', ...prefs });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getUserPreferences(): Promise<UserPreferences | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['userPreferences'], 'readonly');
      const store = transaction.objectStore('userPreferences');
      const request = store.get('user');

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Gestión de cache de weather
  async saveWeatherCache(location: string, data: any, ttl: number = 1800000): Promise<void> {
    const weather: WeatherCache = {
      location,
      data,
      timestamp: Date.now(),
      expires: Date.now() + ttl
    };

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['weatherCache'], 'readwrite');
      const store = transaction.objectStore('weatherCache');
      const request = store.put(weather);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getWeatherCache(location: string): Promise<any | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['weatherCache'], 'readonly');
      const store = transaction.objectStore('weatherCache');
      const request = store.get(location);

      request.onsuccess = () => {
        const weather = request.result;
        if (weather && weather.expires > Date.now()) {
          resolve(weather.data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearExpiredWeatherCache(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['weatherCache'], 'readwrite');
      const store = transaction.objectStore('weatherCache');
      const index = store.index('expires');
      const request = index.openCursor(IDBKeyRange.upperBound(Date.now()));

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Gestión de datos de barcos y puertos
  async saveBoatData(type: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['boatData'], 'readwrite');
      const store = transaction.objectStore('boatData');
      const request = store.put({ type, data, timestamp: Date.now() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getBoatData(type: string): Promise<any | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['boatData'], 'readonly');
      const store = transaction.objectStore('boatData');
      const request = store.get(type);

      request.onsuccess = () => resolve(request.result?.data || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Gestión de historial de viajes
  async saveTripHistory(trip: any): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['tripHistory'], 'readwrite');
      const store = transaction.objectStore('tripHistory');
      const request = store.add({
        ...trip,
        timestamp: Date.now()
      });

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getTripHistory(limit: number = 50): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['tripHistory'], 'readonly');
      const store = transaction.objectStore('tripHistory');
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'prev');

      const trips: any[] = [];
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor && trips.length < limit) {
          trips.push(cursor.value);
          cursor.continue();
        } else {
          resolve(trips);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Sincronización con el servidor
  async syncWithServer(): Promise<void> {
    try {
      // Sincronizar formularios offline
      const unsyncedForms = await this.getUnsyncedForms();
      
      for (const form of unsyncedForms) {
        try {
          const response = await fetch('/api/trip-plan', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(form.data)
          });

          if (response.ok) {
            await this.markFormAsSynced(form.id);
            console.log('Form synced successfully:', form.id);
          }
        } catch (error) {
          console.error('Failed to sync form:', form.id, error);
        }
      }

      // Sincronizar preferencias
      const preferences = await this.getUserPreferences();
      if (preferences) {
        try {
          await fetch('/api/preferences', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(preferences)
          });
          
          await this.saveUserPreferences({ lastSync: Date.now() });
        } catch (error) {
          console.error('Failed to sync preferences:', error);
        }
      }

      // Limpiar cache expirado
      await this.clearExpiredWeatherCache();

    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    }
  }

  // Verificar estado de conectividad
  async isOnline(): Promise<boolean> {
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Obtener estadísticas de uso offline
  async getOfflineStats(): Promise<{
    totalForms: number;
    unsyncedForms: number;
    lastSync: number;
    cacheSize: number;
  }> {
    const forms = await this.getOfflineForms();
    const unsyncedForms = await this.getUnsyncedForms();
    const preferences = await this.getUserPreferences();

    return {
      totalForms: forms.length,
      unsyncedForms: unsyncedForms.length,
      lastSync: preferences?.lastSync || 0,
      cacheSize: await this.getCacheSize()
    };
  }

  private async getCacheSize(): Promise<number> {
    return new Promise((resolve) => {
      if (!this.db) {
        resolve(0);
        return;
      }

      const transaction = this.db.transaction(['offlineForms', 'weatherCache', 'boatData', 'tripHistory'], 'readonly');
      let totalSize = 0;

      ['offlineForms', 'weatherCache', 'boatData', 'tripHistory'].forEach(storeName => {
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => {
          totalSize += request.result.length;
          if (storeName === 'tripHistory') {
            resolve(totalSize);
          }
        };
      });
    });
  }

  // Limpiar todos los datos offline
  async clearAllData(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['offlineForms', 'weatherCache', 'boatData', 'tripHistory'], 'readwrite');
      
      ['offlineForms', 'weatherCache', 'boatData', 'tripHistory'].forEach(storeName => {
        const store = transaction.objectStore(storeName);
        store.clear();
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

// Instancia singleton
const offlineService = new OfflineService();

export default offlineService; 