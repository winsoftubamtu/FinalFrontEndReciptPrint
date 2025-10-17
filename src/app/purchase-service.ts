import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Purchase {
  itemName: string;
  quantity: string;
  priceAtPurchase: number;
  paymentMethod: string;
}

export interface PurchaseBydate{
  itemName: string;
  quantity: string;
  priceAtPurchase: number;
  paymentMethod: string;
  purchasedate:string;
}
@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = 'http://103.102.144.180:2003/api/Purchases';

  constructor(private http: HttpClient) {}

  // Add new purchase
  addPurchase(purchase: Purchase): Observable<any> {
    return this.http.post(this.apiUrl, purchase);
  }

  // Optional: Get all purchases
  getPurchases(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getpurchasebydate(fromDate:string, toDate:string):Observable<PurchaseBydate[]>{
    const url=`${this.apiUrl}/byDate?fromDate=${fromDate}&toDate=${toDate}`;
    return this.http.get<PurchaseBydate[]>(url);
  }
  
}
