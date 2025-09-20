import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private router: Router, private storageService: StorageService) {}

  async canActivate(): Promise<boolean> {
    const token = await this.storageService.get('authToken');

    if (token) {
      return true; // ✅ allow access
    }

    // ❌ no token → redirect to login
    this.router.navigateByUrl('/login', { replaceUrl: true });
    return false;
  }
}
