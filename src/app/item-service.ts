import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
  itemid: number;
  userid: number;
  itemname: string; // <- match backend
  price: number;
}


/** DTO for Add / Update */
export interface ItemRequest {
  itemname: string;
  price: number;
}


@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://103.102.144.180:2003/api/Items'; // ✅ your endpoint


  constructor(private http: HttpClient) {}

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }

    addItem(item: ItemRequest): Observable<any> {
    return this.http.post(this.apiUrl, item);
  }

  updateItem(id: number, item: ItemRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, item);
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
}
