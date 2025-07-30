// services/stateManagementService.ts
// Servicio de gestión de estado avanzado con persistencia offline

interface StateSnapshot {
  id: string;
  state: any;
  timestamp: number;
  version: number;
  synced: boolean;
}

interface StateChange {
  id: string;
  action: string;
  payload: any;
  timestamp: number;
  version: number;
  synced: boolean;
}

interface StateSubscription {
  id: string;
  selector: string;
  callback: (state: any) => void;
  lastValue: any;
}

class StateManagementService {
  private state: any = {};
  private subscribers: Map<string, StateSubscription> = new Map();
  private changeHistory: StateChange[] = [];
  private isOnline: boolean = navigator.onLine;
  private version: number = 0;
  private readonly MAX_HISTORY_SIZE = 1000;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    // Escuchar cambios de conectividad
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncState();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Cargar estado persistido
    await this.loadPersistedState();
    
    // Sincronizar cambios pendientes
    await this.syncState();
  }

  // Métodos principales de gestión de estado
  getState(): any {
    return this.state;
  }

  getStateByPath(path: string): any {
    return this.getNestedValue(this.state, path);
  }

  async setState(newState: any, action?: string): Promise<void> {
    const previousState = { ...this.state };
    this.state = { ...this.state, ...newState };
    this.version++;

    // Registrar cambio
    const stateChange: StateChange = {
      id: crypto.randomUUID(),
      action: action || 'setState',
      payload: newState,
      timestamp: Date.now(),
      version: this.version,
      synced: false
    };

    this.changeHistory.push(stateChange);

    // Limpiar historial si es muy grande
    if (this.changeHistory.length > this.MAX_HISTORY_SIZE) {
      this.changeHistory = this.changeHistory.slice(-this.MAX_HISTORY_SIZE);
    }

    // Guardar cambio en IndexedDB
    await this.saveStateChange(stateChange);

    // Crear snapshot periódico
    if (this.version % 10 === 0) {
      await this.createSnapshot();
    }

    // Notificar suscriptores
    this.notifySubscribers(previousState, this.state);

    // Sincronizar si está online
    if (this.isOnline) {
      await this.sendStateChange(stateChange);
    }
  }

  async dispatch(action: string, payload: any): Promise<void> {
    await this.setState(payload, action);
  }

  // Sistema de suscripciones
  subscribe(selector: string, callback: (state: any) => void): string {
    const subscriptionId = crypto.randomUUID();
    const currentValue = this.getStateByPath(selector);

    const subscription: StateSubscription = {
      id: subscriptionId,
      selector,
      callback,
      lastValue: currentValue
    };

    this.subscribers.set(subscriptionId, subscription);

    // Ejecutar callback inmediatamente
    callback(currentValue);

    return subscriptionId;
  }

  unsubscribe(subscriptionId: string): void {
    this.subscribers.delete(subscriptionId);
  }

  // Persistencia
  async persistState(): Promise<void> {
    try {
      const snapshot: StateSnapshot = {
        id: crypto.randomUUID(),
        state: this.state,
        timestamp: Date.now(),
        version: this.version,
        synced: false
      };

      await this.saveSnapshot(snapshot);
    } catch (error) {
      console.error('Error persistiendo estado:', error);
    }
  }

  async loadPersistedState(): Promise<void> {
    try {
      const snapshot = await this.getLatestSnapshot();
      if (snapshot) {
        this.state = snapshot.state;
        this.version = snapshot.version;
        console.log('Estado cargado desde persistencia');
      }
    } catch (error) {
      console.error('Error cargando estado persistido:', error);
    }
  }

  // Sincronización
  private async syncState(): Promise<void> {
    if (!this.isOnline) return;

    try {
      // Sincronizar cambios pendientes
      const pendingChanges = await this.getPendingStateChanges();
      for (const change of pendingChanges) {
        await this.sendStateChange(change);
      }

      // Sincronizar snapshots pendientes
      const pendingSnapshots = await this.getPendingSnapshots();
      for (const snapshot of pendingSnapshots) {
        await this.sendSnapshot(snapshot);
      }
    } catch (error) {
      console.error('Error sincronizando estado:', error);
    }
  }

  // Utilidades
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  private notifySubscribers(previousState: any, newState: any): void {
    this.subscribers.forEach((subscription) => {
      const previousValue = this.getNestedValue(previousState, subscription.selector);
      const newValue = this.getNestedValue(newState, subscription.selector);

      // Solo notificar si el valor cambió
      if (JSON.stringify(previousValue) !== JSON.stringify(newValue)) {
        subscription.lastValue = newValue;
        subscription.callback(newValue);
      }
    });
  }

  // IndexedDB operations
  private async saveStateChange(stateChange: StateChange): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['stateChanges'], 'readwrite');
      const store = transaction.objectStore('stateChanges');
      await store.add(stateChange);
    } catch (error) {
      console.error('Error guardando cambio de estado:', error);
    }
  }

  private async saveSnapshot(snapshot: StateSnapshot): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['stateSnapshots'], 'readwrite');
      const store = transaction.objectStore('stateSnapshots');
      await store.add(snapshot);
    } catch (error) {
      console.error('Error guardando snapshot:', error);
    }
  }

  private async createSnapshot(): Promise<void> {
    await this.persistState();
  }

  private async getLatestSnapshot(): Promise<StateSnapshot | null> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['stateSnapshots'], 'readonly');
      const store = transaction.objectStore('stateSnapshots');
      const index = store.index('timestamp');
      const snapshots = await index.getAll();
      
      if (snapshots.length > 0) {
        return snapshots[snapshots.length - 1];
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo último snapshot:', error);
      return null;
    }
  }

  private async getPendingStateChanges(): Promise<StateChange[]> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['stateChanges'], 'readonly');
      const store = transaction.objectStore('stateChanges');
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const allChanges = request.result;
          const pendingChanges = allChanges.filter((change: StateChange) => !change.synced);
          resolve(pendingChanges);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error obteniendo cambios pendientes:', error);
      return [];
    }
  }

  private async getPendingSnapshots(): Promise<StateSnapshot[]> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['stateSnapshots'], 'readonly');
      const store = transaction.objectStore('stateSnapshots');
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const allSnapshots = request.result;
          const pendingSnapshots = allSnapshots.filter((snapshot: StateSnapshot) => !snapshot.synced);
          resolve(pendingSnapshots);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error obteniendo snapshots pendientes:', error);
      return [];
    }
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('StateManagementDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Crear stores
        if (!db.objectStoreNames.contains('stateChanges')) {
          const changeStore = db.createObjectStore('stateChanges', { keyPath: 'id' });
          changeStore.createIndex('timestamp', 'timestamp');
          changeStore.createIndex('version', 'version');
          changeStore.createIndex('synced', 'synced');
        }

        if (!db.objectStoreNames.contains('stateSnapshots')) {
          const snapshotStore = db.createObjectStore('stateSnapshots', { keyPath: 'id' });
          snapshotStore.createIndex('timestamp', 'timestamp');
          snapshotStore.createIndex('version', 'version');
          snapshotStore.createIndex('synced', 'synced');
        }
      };
    });
  }

  // API calls
  private async sendStateChange(stateChange: StateChange): Promise<void> {
    try {
      await fetch('/api/state/changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stateChange)
      });

      // Marcar como sincronizado
      stateChange.synced = true;
      await this.updateStateChange(stateChange);
    } catch (error) {
      console.error('Error enviando cambio de estado:', error);
    }
  }

  private async sendSnapshot(snapshot: StateSnapshot): Promise<void> {
    try {
      await fetch('/api/state/snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot)
      });

      // Marcar como sincronizado
      snapshot.synced = true;
      await this.updateSnapshot(snapshot);
    } catch (error) {
      console.error('Error enviando snapshot:', error);
    }
  }

  private async updateStateChange(stateChange: StateChange): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['stateChanges'], 'readwrite');
      const store = transaction.objectStore('stateChanges');
      await store.put(stateChange);
    } catch (error) {
      console.error('Error actualizando cambio de estado:', error);
    }
  }

  private async updateSnapshot(snapshot: StateSnapshot): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['stateSnapshots'], 'readwrite');
      const store = transaction.objectStore('stateSnapshots');
      await store.put(snapshot);
    } catch (error) {
      console.error('Error actualizando snapshot:', error);
    }
  }

  // Métodos públicos para gestión específica
  async setUserPreferences(preferences: any): Promise<void> {
    await this.setState({ userPreferences: preferences }, 'setUserPreferences');
  }

  async setTripData(tripData: any): Promise<void> {
    await this.setState({ tripData }, 'setTripData');
  }

  async setOfflineData(offlineData: any): Promise<void> {
    await this.setState({ offlineData }, 'setOfflineData');
  }

  async setAppSettings(settings: any): Promise<void> {
    await this.setState({ appSettings: settings }, 'setAppSettings');
  }

  // Getters específicos
  getUserPreferences(): any {
    return this.getStateByPath('userPreferences');
  }

  getTripData(): any {
    return this.getStateByPath('tripData');
  }

  getOfflineData(): any {
    return this.getStateByPath('offlineData');
  }

  getAppSettings(): any {
    return this.getStateByPath('appSettings');
  }

  // Métodos de utilidad
  getVersion(): number {
    return this.version;
  }

  getChangeHistory(): StateChange[] {
    return [...this.changeHistory];
  }

  getSubscriberCount(): number {
    return this.subscribers.size;
  }

  // Limpieza
  async clearHistory(): Promise<void> {
    this.changeHistory = [];
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['stateChanges'], 'readwrite');
      const store = transaction.objectStore('stateChanges');
      await store.clear();
    } catch (error) {
      console.error('Error limpiando historial:', error);
    }
  }

  async resetState(): Promise<void> {
    this.state = {};
    this.version = 0;
    this.changeHistory = [];
    this.subscribers.clear();
    
    // Limpiar IndexedDB
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['stateChanges', 'stateSnapshots'], 'readwrite');
      await transaction.objectStore('stateChanges').clear();
      await transaction.objectStore('stateSnapshots').clear();
    } catch (error) {
      console.error('Error reseteando estado:', error);
    }
  }
}

// Instancia singleton
const stateManagementService = new StateManagementService();
export default stateManagementService; 