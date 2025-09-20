
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonItem, IonList, IonLabel, IonInput, IonTextarea, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonRadio,
  IonSegment,
  IonSegmentButton
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
// Cordova wrappers (ngx)
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonItem, IonList, IonLabel, IonInput, IonTextarea,
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonRadio,IonSegment, IonSegmentButton, ExploreContainerComponent],
    providers: [BluetoothSerial, AndroidPermissions]
})
export class Tab1Page implements OnInit {
  devices: any[] = [];
  selectedDevice: any = null;
  statusMessage = '';
  //expiryDate = new Date("2025-09-13"); // YYYY-MM-DD format
  expiryDate = new Date("2026-09-16");
  paymentType: string = 'Cash'; // default selected
   // Billing form
  itemName = '';
  quantity: number | null = null;
  price: number | null = null;
  items: Array<{name:string, qty:number, price:number}> = [];
  constructor(
    private bluetoothSerial: BluetoothSerial,
    private androidPermissions: AndroidPermissions
  ) {
    this.checkBluetoothEnabled();
  }
   async ngOnInit() {
    await this.requestBluetoothPermissions();
  }

//below function is temporary for lock the app
checkExpiry(): boolean {
  const today = new Date();

  // remove time part (only compare date)
  today.setHours(0, 0, 0, 0);
  this.expiryDate.setHours(0, 0, 0, 0);

  if (today > this.expiryDate) {
    alert("This app has been expired. Please contact to office:- 9370239743.");
    return false;
  }
  return true;
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

  /* ----------------------
     Bluetooth helpers
     ---------------------- */
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
    this.bluetoothSerial.list().then(devs => {
      // typical fields: { id, name, address, class }
      this.devices = devs;
      if (!this.devices || this.devices.length === 0) {
        this.statusMessage = 'No paired devices found — pair printer in Android settings first';
      } else {
        this.statusMessage = `${this.devices.length} paired device(s) found`;
      }
    }).catch(err => {
      this.statusMessage = 'Error listing devices: ' + err;
    });
  }

  
//button connect and disconnect 
toggleConnection(device: any) {
  const addr = device.address || device.id;

  // If already connected to this device → disconnect
  if (this.selectedDevice && this.selectedDevice.address === addr) {
    this.bluetoothSerial.disconnect();
    this.selectedDevice = null;
    this.statusMessage = 'Disconnected from ' + (device.name || addr);
  } else {
    // Try connecting
    this.statusMessage = 'Connecting to ' + (device.name || addr) + '...';
    this.bluetoothSerial.connect(addr).subscribe(
      () => {
        this.selectedDevice = device;
        this.statusMessage = 'Connected to ' + (device.name || addr);
      },
      err => {
        this.selectedDevice = null;
        this.statusMessage = 'Connection failed: ' + JSON.stringify(err);
      }
    );
  }
}




  addItem() {
 //here we are checking for expiry date
    if (!this.checkExpiry()) {
    return; // stop execution if expired
  }
  if (!this.itemName || !this.quantity || !this.price) {
    alert('Please fill item, qty, price');
    return;
  }

  // Check if item already exists
  const existing = this.items.find(it => it.name.toLowerCase() === this.itemName.toLowerCase());

  if (existing) {
    existing.qty += this.quantity; // add to existing qty
  } else {
    this.items.push({ name: this.itemName, qty: this.quantity, price: this.price });
  }

  this.itemName = '';
  this.quantity = null;
  this.price = null;
}


increaseQty(index: number) {
  this.items[index].qty++;
}

decreaseQty(index: number) {
  if (this.items[index].qty > 1) {
    this.items[index].qty--;
  } else {
    this.items.splice(index, 1); // remove if qty goes below 1
  }
}


  removeItem(idx: number) {
    this.items.splice(idx, 1);
  }

  /* ----------------------
     Print helpers (ESC/POS)
     ---------------------- */
  // Convert JS string to ArrayBuffer of raw bytes (simple 8-bit)
  private strToArrayBuffer(str: string): ArrayBuffer {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0; i < str.length; i++) {
      bufView[i] = str.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  // Format line to fixed-width (for typical 58mm 32-char paper or 80mm 48-char adjust)
  private formatLine(name: string, qty: number, price: number, total: number, nameWidth = 16) {
    // keep ASCII only for reliability
    let nm = name.length > nameWidth ? name.slice(0, nameWidth) : name.padEnd(nameWidth, ' ');
    const qtyStr = qty.toString().padStart(3, ' ');
    const priceStr = price.toString().padStart(6, ' ');
    const totalStr = total.toString().padStart(7, ' ');
    return `${nm}${qtyStr}${priceStr}${totalStr}`;
  }

async printReceipt() {
  if (!this.selectedDevice) {
    this.statusMessage = 'Select and connect a printer first!';
    return;
  }
  if (!this.items || this.items.length === 0) {
    this.statusMessage = 'Add at least one item to print';
    return;
  }

  const ESC = '\x1B';
  const GS = '\x1D';

  let grandTotal = 0;
  let receipt = '';

  // Header
  receipt += ESC + 'a' + String.fromCharCode(1); // center
  receipt += ESC + '\x45' + String.fromCharCode(1); // bold on
  receipt += '*** My Hotel & Bakery ***\n';
  receipt += ESC + '\x45' + String.fromCharCode(0); // bold off
  receipt += ESC + 'a' + String.fromCharCode(0); // left

  receipt += `Date: ${new Date().toLocaleString()}\n`;
  receipt += `Payment: ${this.paymentType}\n`;   // ✅ Added here
  receipt += '--------------------------------\n';

  receipt += '--------------------------------\n';
  receipt += 'Item            QTY  PRICE  TOTAL\n';
  receipt += '--------------------------------\n';

  this.items.forEach(i => {
    const total = i.qty * i.price;
    grandTotal += total;
    receipt += this.formatLine(i.name, i.qty, i.price, total) + '\n';
  });

  receipt += '--------------------------------\n';

  // Grand total (normal size, bold only)
  receipt += ESC + 'a' + String.fromCharCode(2); // right align
  receipt += ESC + '\x45' + String.fromCharCode(1); // bold on
  receipt += `Grand Total: Rs ${grandTotal}\n`;
  receipt += ESC + '\x45' + String.fromCharCode(0); // bold off
  receipt += ESC + 'a' + String.fromCharCode(0); // left align

  receipt += '\nThank you! Visit Again!\n\n\n';

  // Feed & cut
  receipt += GS + 'V' + '\x00';

  const buf = this.strToArrayBuffer(receipt);
  try {
    await this.bluetoothSerial.write(buf);
    this.statusMessage = 'Receipt sent to printer';
  } catch (err) {
    this.statusMessage = 'Print failed: ' + JSON.stringify(err);
  }
}


  get grandTotal(): number {
  return this.items.reduce((sum, it) => sum + (it.qty * it.price), 0);
  }

}
