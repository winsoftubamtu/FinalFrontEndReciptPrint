import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AlertController,
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent,
  IonIcon, IonInput, IonInputPasswordToggle, IonItem, IonLabel, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline, personCircleOutline, lockClosedOutline } from 'ionicons/icons';
import { AuthResponse, AuthService } from '../auth.service';
import { StorageService } from '../storage.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
   imports: [IonInputPasswordToggle ,
    CommonModule, FormsModule,
    IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent,
    IonIcon, IonInput, IonItem, IonLabel, IonSpinner
  ]
})
export class LoginPage implements OnInit {
username = '';
  password = '';
  isLoading = false;
  showPassword = false;


  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private storageService: StorageService
  ) {
    addIcons({ logInOutline, personCircleOutline, lockClosedOutline });
  }

  ngOnInit() {
    console.log('🔍 ngOnInit called');
  }
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  login() {
    if (!this.username || !this.password) {
      this.presentAlert('Error', 'Please enter both Username and Password.');
      return;
    }

    this.isLoading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: async (response: AuthResponse) => {
        console.log('✅ Login success:', response);
        this.isLoading = false;

        const token = await this.storageService.get('authToken');
        console.log('🔐 Token stored:', token);
         // Save token
    await this.storageService.set('authToken', response.token);

    // Save storeName
    await this.storageService.set('storeName', response.storeName);

    await this.storageService.set('Passwordhash',response.passwordhash);

     await this.storageService.set('Address',response.address);
      await this.storageService.set('Expirydate',response.expirydate);

    console.log('🔐 Token stored:', response.token);
    console.log('🏪 StoreName stored:', response.storeName);
    console.log('pass', response.passwordhash);
     console.log('add', response.passwordhash, response.expirydate);
        

       // this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true }); // ✅ redirect to tab1
       this.router.navigate(['/tabs', 'tab1'], { replaceUrl: true });

      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.error('❌ Login error:', err);

        let message = 'Invalid Username or Password.';
        if (err.error && err.error.message) {
          message = err.error.message;
        }

        this.presentAlert('Login Failed', message);
      }
    });
  }

  togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}


}
