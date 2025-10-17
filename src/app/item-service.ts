import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
  itemid: number;
  userid: number;
  itemname: string; // <- match backend
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

  
  
}
