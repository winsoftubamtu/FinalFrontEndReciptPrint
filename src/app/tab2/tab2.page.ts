import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonTitle, IonToolbar, LoadingController, ToastController } from '@ionic/angular/standalone';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { PrinterService } from '../printer-service';
import { Purchase, PurchaseService } from '../purchase-service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone:true,
   imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonButton,IonList
  ],
  //imports: [IonContent, IonButton, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonList,IonItem,IonLabel, ExploreContainerComponent],
   providers: [BluetoothSerial, AndroidPermissions]
})
export class Tab2Page implements OnInit {
  purchase: Purchase = {
    itemName: '',
    quantity: '',
    priceAtPurchase: 0,
    paymentMethod: ''
  };
 purchases: Purchase[] = []; // List of added items
devices: any[] = [];
 //selectedDevice: any = null;
 showDevices: boolean = false; 
 selectedDevice = this.printerService.selectedDevice;
  statusMessage = '';
  constructor(
     private bluetoothSerial: BluetoothSerial,
    private androidPermissions: AndroidPermissions,
    private printerService: PrinterService,
     private purchaseService: PurchaseService,
      private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { 
    this.checkBluetoothEnabled();
  }

 async ngOnInit() {
    await this.requestBluetoothPermissions();
  }

  async requestBluetoothPermissions() {
    try {
      // AndroidPermissions plugin uses constants under .PERMISSION
      const perms = [
        this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
        this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
        this.androidPermissions.PERMISSION.BLUETOOTH_ADVERTISE,
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
      ];

      for (const p of perms) {
        const res = await this.androidPermissions.checkPermission(p);
        if (!res.hasPermission) {
          await this.androidPermissions.requestPermission(p);
        }
      }
    } catch (err) {
      console.warn('Permission request error', err);
    }
  }

  async checkBluetoothEnabled() {
    try {
      const enabled = await this.bluetoothSerial.isEnabled();
      // if not enabled, .isEnabled() will reject — call .enable() if you want
    } catch (err) {
      // plugin may reject, ask user to enable
      this.statusMessage = 'Please enable Bluetooth on the device';
    }
  }


  async enableBluetooth() {
    // this will prompt user to enable Bluetooth
    try {
      await this.bluetoothSerial.enable();
      this.statusMessage = 'Bluetooth enabled';
    } catch (err) {
      this.statusMessage = 'Unable to enable Bluetooth: ' + err;
    }
  }

  listDevices() {
     this.showDevices = !this.showDevices;
     
      if (this.showDevices) {
    this.bluetoothSerial.list().then((allDevices) => {
      this.devices = allDevices;
    }).catch(err => {
      this.statusMessage = 'Error listing devices: ' + err;
    });
  }
  }

  // connect(device: any) {
  //   this.bluetoothSerial.connect(device.address).subscribe(success => {
  //     this.selectedDevice = device;
  //     this.statusMessage = 'Connected successfully!';
  //   }, error => {
  //     this.statusMessage = 'Connection failed: ' + error;
  //   });
  // }

  

toggleConnection(device: any) {
  const addr = device.address || device.id;

  // If already connected to this device → disconnect
  if (this.printerService.selectedDevice && this.printerService.selectedDevice.address === addr) {
    this.bluetoothSerial.disconnect();
    this.printerService.selectedDevice = null;
    this.statusMessage = 'Disconnected from ' + (device.name || addr);
  } else {
    // Try connecting
    this.statusMessage = 'Connecting to ' + (device.name || addr) + '...';
    this.bluetoothSerial.connect(addr).subscribe(
      () => {
        this.printerService.selectedDevice = device;
        this.statusMessage = 'Connected to ' + (device.name || addr);
      },
      err => {
        this.printerService.selectedDevice = null;
        this.statusMessage = 'Connection failed: ' + JSON.stringify(err);
      }
    );
  }
}

addToList() {
    if (!this.purchase.itemName?.trim() ||
        !this.purchase.quantity?.trim() ||
        this.purchase.priceAtPurchase <= 0 ||
        !this.purchase.paymentMethod) {
      this.showToast('Please fill all fields');
      return;
    }

    // Push item to list
    this.purchases.push({ ...this.purchase });
    this.resetForm();
    this.showToast('Item added to list ✅');
  }

  async saveAll() {
    if (this.purchases.length === 0) {
      this.showToast('No items to save');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Saving all purchases...',
      spinner: 'crescent'
    });
    await loading.present();

    let successCount = 0;

    for (const item of this.purchases) {
      try {
        await this.purchaseService.addPurchase(item).toPromise();
        successCount++;
      } catch {
        // Continue even if one fails
      }
    }

    await loading.dismiss();
    this.showToast(`Saved ${successCount} / ${this.purchases.length} items`);
    this.purchases = [];
  }

  resetForm() {
    this.purchase = {
      itemName: '',
      quantity: '',
      priceAtPurchase: 0,
      paymentMethod: ''
    };
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  onPriceInput(event: any) {
    this.purchase.priceAtPurchase = +event.target.value;
  }
}
