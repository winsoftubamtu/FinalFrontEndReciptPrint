import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,IonMenuButton,IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { BillLocalService } from '../bill-local-service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.page.html',
  styleUrls: ['./profit-loss.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,IonMenuButton,IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProfitLossPage implements OnInit {
  
  storeName: string = '';
  constructor(    private storageService: StorageService,
        private billLocalService: BillLocalService

  ) { }

 async  ngOnInit() {
    await this.billLocalService.init();
      await this.storageService.init();
      this.storeName = (await this.storageService.get('storeName')) ?? '';

  }

}
