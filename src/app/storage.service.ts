import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Drivers } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  constructor(private storage: Storage) {
    this.init();
  }
  // ✅ Initialize storage
  async init() {
    const storage = new Storage({
      name: '__mydb',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    });
    this._storage = await storage.create();
    
  }

  
  // ✅ Set a value
  public async set(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value);
  }

  // ✅ Get a value
  public async get(key: string): Promise<any> {
    return await this._storage?.get(key);
  }

  // ✅ Remove a value
  public async remove(key: string): Promise<void> {
    await this._storage?.remove(key);
  }

  // ✅ Clear all storage
  public async clear(): Promise<void> {
    await this._storage?.clear();
  }
}
