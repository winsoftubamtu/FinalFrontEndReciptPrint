import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { Transaction } from '../models/transaction';
export interface TransactionItem {
  itemId: number;        // must match backend ItemId 
  quantity: number;
  priceAtSale: number;
}

export interface Transaction {
  totalAmount: number;
  paymentMethod: string;     // Cash / Online
  items: TransactionItem[];
}

// ------------------ GET (Fetch) ------------------
export interface TransactionItemGet {
  itemId: number;
  itemName: string;        // comes from backend
  quantity: number;
  priceAtSale: number;
}

export interface TransactionGet {
  transactionId: number;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  items: TransactionItemGet[];
}


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://192.168.10.20:7089/api/Transactions'; // backend endpoint

  constructor(private http: HttpClient) {}

  saveTransaction(transaction: Transaction): Observable<any> {
    // No need to manually add Authorization header, interceptor does it
    return this.http.post(this.apiUrl, transaction);
  }

     // ✅ Get all transactions
  getAllTransactions(): Observable<TransactionGet[]> {
    return this.http.get<TransactionGet[]>(this.apiUrl);
  }

  // ✅ Get transactions by date range
  getTransactionsByDate(fromDate: string, toDate: string): Observable<TransactionGet[]> {
    const url = `${this.apiUrl}/byDate?fromDate=${fromDate}&toDate=${toDate}`;
    return this.http.get<TransactionGet[]>(url);
  }
  
}
