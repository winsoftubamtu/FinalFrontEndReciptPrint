import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { IonicStorageModule, provideStorage } from '@ionic/storage-angular';
import { importProvidersFrom } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Drivers } from '@ionic/storage'; 
import { AuthInterceptor } from './app/AuthInterceptor ';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimations(),
   // provideHttpClient(),
  provideHttpClient(withInterceptorsFromDi()),

    importProvidersFrom(
      IonicModule.forRoot(),
      IonicStorageModule.forRoot({
        name: '__mydb',
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
      })
    ),
     { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // ✅ register yours
  ]
});
