import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { StorageService } from './storage.service';

export interface AuthResponse {
  token: string; // ✅ your API only returns token
  storeName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   private apiUrl = 'https://localhost:7089/api/Auth/login'; // ✅ your API
   
   constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}
   login(username: string, password: string): Observable<AuthResponse> {
    const rawJson = {
      username: username.toString(),
      password: password.toString()
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<AuthResponse>(this.apiUrl, JSON.stringify(rawJson), { headers }).pipe(
      tap(async (response) => {
        if (response && response.token) {
          await this.storageService.set('authToken', response.token);
          await this.storageService.set('user', response);
        }

      })
    );
  }
}
