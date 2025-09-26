
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import {
//   IonHeader, IonToolbar, IonTitle, IonContent,
//   IonButton, IonItem, IonList, IonLabel, IonInput, IonTextarea, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
//   IonRadio,
//   IonSegment,
//   IonSegmentButton
// } from '@ionic/angular/standalone';
// import { ExploreContainerComponent } from '../explore-container/explore-container.component';
// // Cordova wrappers (ngx)
// import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
// import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
// import { StorageService } from '../storage.service';
// @Component({
//   selector: 'app-tab1',
//   templateUrl: 'tab1.page.html',
//   styleUrls: ['tab1.page.scss'],
//   imports: [CommonModule, FormsModule,
//     IonHeader, IonToolbar, IonTitle, IonContent,
//     IonButton, IonItem, IonList, IonLabel, IonInput, IonTextarea,
//     IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonRadio,IonSegment, IonSegmentButton, ExploreContainerComponent],
//     providers: [BluetoothSerial, AndroidPermissions]
// })
// export class Tab1Page implements OnInit {
//     storeName: string = '';
//   devices: any[] = [];
//   selectedDevice: any = null;
//   statusMessage = '';
//     expiryDate = new Date("2026-09-16"); // YYYY-MM-DD format
//   paymentType: string = 'Cash'; // default selected
//    // Billing form
//   itemName = '';
//   quantity: number | null = null;
//   price: number | null = null;
//   items: Array<{name:string, qty:number, price:number}> = [];
//   constructor(
//     private bluetoothSerial: BluetoothSerial,
//     private androidPermissions: AndroidPermissions,
//     private storageService: StorageService
//   ) {
//     this.checkBluetoothEnabled();
//   }
//    async ngOnInit() {
//       this.storeName = await this.storageService.get('storeName');
//     console.log('🏪 Loaded StoreName:', this.storeName);
//     await this.requestBluetoothPermissions();
//   }

// //below function is temporary for lock the app
// checkExpiry(): boolean {
//   const today = new Date();

//   // remove time part (only compare date)
//   today.setHours(0, 0, 0, 0);
//   this.expiryDate.setHours(0, 0, 0, 0);

//   if (today > this.expiryDate) {
//     alert("This app has been expired. Please contact to office:- 9370239743.");
//     return false;
//   }
//   return true;
// }

  
//   async requestBluetoothPermissions() {
//     try {
//       // AndroidPermissions plugin uses constants under .PERMISSION
//       const perms = [
//         this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
//         this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
//         this.androidPermissions.PERMISSION.BLUETOOTH_ADVERTISE,
//         this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
//       ];

//       for (const p of perms) {
//         const res = await this.androidPermissions.checkPermission(p);
//         if (!res.hasPermission) {
//           await this.androidPermissions.requestPermission(p);
//         }
//       }
//     } catch (err) {
//       console.warn('Permission request error', err);
//     }
//   }

//   /* ----------------------
//      Bluetooth helpers
//      ---------------------- */
//   async checkBluetoothEnabled() {
//     try {
//       const enabled = await this.bluetoothSerial.isEnabled();
//       // if not enabled, .isEnabled() will reject — call .enable() if you want
//     } catch (err) {
//       // plugin may reject, ask user to enable
//       this.statusMessage = 'Please enable Bluetooth on the device';
//     }
//   }

//   async enableBluetooth() {
//     // this will prompt user to enable Bluetooth
//     try {
//       await this.bluetoothSerial.enable();
//       this.statusMessage = 'Bluetooth enabled';
//     } catch (err) {
//       this.statusMessage = 'Unable to enable Bluetooth: ' + err;
//     }
//   }

//   listDevices() {
//     this.bluetoothSerial.list().then(devs => {
//       // typical fields: { id, name, address, class }
//       this.devices = devs;
//       if (!this.devices || this.devices.length === 0) {
//         this.statusMessage = 'No paired devices found — pair printer in Android settings first';
//       } else {
//         this.statusMessage = `${this.devices.length} paired device(s) found`;
//       }
//     }).catch(err => {
//       this.statusMessage = 'Error listing devices: ' + err;
//     });
//   }

  
// //button connect and disconnect 
// toggleConnection(device: any) {
//   const addr = device.address || device.id;

//   // If already connected to this device → disconnect
//   if (this.selectedDevice && this.selectedDevice.address === addr) {
//     this.bluetoothSerial.disconnect();
//     this.selectedDevice = null;
//     this.statusMessage = 'Disconnected from ' + (device.name || addr);
//   } else {
//     // Try connecting
//     this.statusMessage = 'Connecting to ' + (device.name || addr) + '...';
//     this.bluetoothSerial.connect(addr).subscribe(
//       () => {
//         this.selectedDevice = device;
//         this.statusMessage = 'Connected to ' + (device.name || addr);
//       },
//       err => {
//         this.selectedDevice = null;
//         this.statusMessage = 'Connection failed: ' + JSON.stringify(err);
//       }
//     );
//   }
// }




//   addItem() {
//  //here we are checking for expiry date
//     if (!this.checkExpiry()) {
//     return; // stop execution if expired
//   }
//   if (!this.itemName || !this.quantity || !this.price) {
//     alert('Please fill item, qty, price');
//     return;
//   }
  
//   // Check if item already exists
//   const existing = this.items.find(it => it.name.toLowerCase() === this.itemName.toLowerCase());

//   if (existing) {
//     existing.qty += this.quantity; // add to existing qty
//   } else {
//     this.items.push({ name: this.itemName, qty: this.quantity, price: this.price });
//   }

//   this.itemName = '';
//   this.quantity = null;
//   this.price = null;
// }


// increaseQty(index: number) {
//   this.items[index].qty++;
// }

// decreaseQty(index: number) {
//   if (this.items[index].qty > 1) {
//     this.items[index].qty--;
//   } else {
//     this.items.splice(index, 1); // remove if qty goes below 1
//   }
// }


//   removeItem(idx: number) {
//     this.items.splice(idx, 1);
//   }

//   /* ----------------------
//      Print helpers (ESC/POS)
//      ---------------------- */
//   // Convert JS string to ArrayBuffer of raw bytes (simple 8-bit)
//   private strToArrayBuffer(str: string): ArrayBuffer {
//     const buf = new ArrayBuffer(str.length);
//     const bufView = new Uint8Array(buf);
//     for (let i = 0; i < str.length; i++) {
//       bufView[i] = str.charCodeAt(i) & 0xFF;
//     }
//     return buf;
//   }

//   // Format line to fixed-width (for typical 58mm 32-char paper or 80mm 48-char adjust)
//   private formatLine(name: string, qty: number, price: number, total: number, nameWidth = 16) {
//     // keep ASCII only for reliability
//     let nm = name.length > nameWidth ? name.slice(0, nameWidth) : name.padEnd(nameWidth, ' ');
//     const qtyStr = qty.toString().padStart(3, ' ');
//     const priceStr = price.toString().padStart(6, ' ');
//     const totalStr = total.toString().padStart(7, ' ');
//     return `${nm}${qtyStr}${priceStr}${totalStr}`;
//   }

// async printReceipt() {
//   if (!this.selectedDevice) {
//     this.statusMessage = 'Select and connect a printer first!';
//     return;
//   }
//   if (!this.items || this.items.length === 0) {
//     this.statusMessage = 'Add at least one item to print';
//     return;
//   }

//   const ESC = '\x1B';
//   const GS = '\x1D';

//   let grandTotal = 0;
//   let receipt = '';

//   // Header
//   receipt += ESC + 'a' + String.fromCharCode(1); // center
//   receipt += ESC + '\x45' + String.fromCharCode(1); // bold on
//   receipt += this.storeName;
//   receipt += ESC + '\x45' + String.fromCharCode(0); // bold off
//   receipt += ESC + 'a' + String.fromCharCode(0); // left

//   receipt += `Date: ${new Date().toLocaleString()}\n`;
//   receipt += `Payment: ${this.paymentType}\n`;   // ✅ Added here
//   receipt += '--------------------------------\n';

//   receipt += '--------------------------------\n';
//   receipt += 'Item            QTY  PRICE  TOTAL\n';
//   receipt += '--------------------------------\n';

//   this.items.forEach(i => {
//     const total = i.qty * i.price;
//     grandTotal += total;
//     receipt += this.formatLine(i.name, i.qty, i.price, total) + '\n';
//   });

//   receipt += '--------------------------------\n';

//   // Grand total (normal size, bold only)
//   receipt += ESC + 'a' + String.fromCharCode(2); // right align
//   receipt += ESC + '\x45' + String.fromCharCode(1); // bold on
//   receipt += `Grand Total: Rs ${grandTotal}\n`;
//   receipt += ESC + '\x45' + String.fromCharCode(0); // bold off
//   receipt += ESC + 'a' + String.fromCharCode(0); // left align

//   receipt += '\nThank you! Visit Again!\n\n\n';

//   // Feed & cut
//   receipt += GS + 'V' + '\x00';

//   const buf = this.strToArrayBuffer(receipt);
//   try {
//     await this.bluetoothSerial.write(buf);
//     this.statusMessage = 'Receipt sent to printer';
//   } catch (err) {
//     this.statusMessage = 'Print failed: ' + JSON.stringify(err);
//   }
// }



//   get grandTotal(): number {
//   return this.items.reduce((sum, it) => sum + (it.qty * it.price), 0);
//   }

// }













import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSpinner,
   IonInput,
  IonList,
  IonItemOption,
  IonRow,
  IonCol,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonSegmentButton,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonTextarea,
  IonRadio,
  IonSegment,
  AlertController,

  
} from '@ionic/angular/standalone';
import { Item, ItemService } from '../item-service';
import { Transaction, TransactionService } from '../TransactionService ';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
// Cordova wrappers (ngx)
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { StorageService } from '../storage.service';
import { PrinterService } from '../printer-service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonItemOption,IonSpinner,IonSelectOption,IonSelect,CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonItem, IonList, IonLabel, IonInput, IonTextarea,
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonRadio,IonSegment, IonSegmentButton, ExploreContainerComponent],
    providers: [BluetoothSerial, AndroidPermissions]
})
export class Tab1Page implements OnInit {
   devices: any[] = [];
  //selectedDevice: any = null;
   statusMessage = '';
    storeName: string = '';
     items: Array<{id:number, name: string, qty: number, price: number }> = [];
  // search related
  allItems: Item[] = [];
  filteredItems: Item[] = [];
  searchText = '';
  showDropdown = false;
  selectedItem?: Item;
paymentType: string = 'Cash'; // default selected
  // form input
  quantity: number | null = null;
  price: number | null = null;
    expiryDate = new Date("2026-09-16"); // YYYY-MM-DD format
    shouldPrint: boolean = true; // default checked

  
  constructor(
    private bluetoothSerial: BluetoothSerial,
    private androidPermissions: AndroidPermissions,
    private storageService: StorageService,
    private itemService: ItemService,
    private transactionService: TransactionService,
    private alertController: AlertController,
    private printerService: PrinterService
  ) {
    
    this.checkBluetoothEnabled();
  }
   async ngOnInit() {
    this.fetchItems();
      this.storeName = await this.storageService.get('storeName');
    console.log('🏪 Loaded StoreName:', this.storeName);
    await this.requestBluetoothPermissions();
  }
 async showPopup(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  fetchItems() {
    this.itemService.getItems().subscribe({
      next: (data: Item[]) => {
        this.allItems = data;
        this.filteredItems = data;
      },
      error: (err) => console.error('❌ Error fetching items:', err)
    });
  }

  onSearchChange(event: any) {
    const val = event.target.value.toLowerCase();
    this.showDropdown = val.length > 0;
    this.filteredItems = this.allItems.filter(i =>
      i.itemname.toLowerCase().includes(val)
    );
  }

   selectItem(item: Item) {
    this.selectedItem = item;
    this.searchText = item.itemname;
        this.price = item.price; // auto-fill price
    this.showDropdown = false;

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

   /* ----------------------
     Bluetooth helpers
     ---------------------- */


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
  //const selectedDevice = this.printerService.selectedDevice;
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




  
  addItem() {
    if (!this.selectedItem || !this.quantity) {
      alert('Please select item and enter quantity');
      return;
    }

    const existing = this.items.find(it => it.name === this.selectedItem!.itemname);

    if (existing) {
      existing.qty += this.quantity;
    } else {
      this.items.push({
         id: this.selectedItem.itemid,
        name: this.selectedItem.itemname,
        qty: this.quantity,
        price: this.selectedItem.price
      });
    }

    // reset form
    this.selectedItem = undefined;
    this.searchText = '';
    this.quantity = null;
  }


increaseQty(index: number) {
    this.items[index].qty++;
  }

  decreaseQty(index: number) {
    if (this.items[index].qty > 1) {
      this.items[index].qty--;
    } else {
      this.items.splice(index, 1);
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
  await this.showPopup("⚡ Info", "printReceipt function triggered");
   if (!this.printerService.selectedDevice) {
      await this.showPopup("🚨 Error", "Select and connect a printer first!");
      return;
    }
   if (!this.items || this.items.length === 0) {
      await this.showPopup("🚨 Error", "No items found to print!");
      return;
    }

  const ESC = '\x1B';
  const GS = '\x1D';

  let grandTotal = 0;
  let receipt = '';

  // Header
  receipt += ESC + 'a' + String.fromCharCode(1); // center
  receipt += ESC + '\x45' + String.fromCharCode(1); // bold on
  receipt += this.storeName;
  receipt += ESC + '\x45' + String.fromCharCode(0); // bold off
  receipt += ESC + 'a' + String.fromCharCode(0); // left

  receipt += `Date: ${new Date().toLocaleString()}\n`;
  receipt += `Payment: ${this.paymentType}\n`;   // ✅ Added here
  receipt += '--------------------------------\n';

  receipt += '--------------------------------\n';
  receipt += 'Item           QTY  PRICE  TOTAL\n';
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
      await this.showPopup("✅ Success", "Receipt sent to printer");
    } catch (err) {
      await this.showPopup("❌ Failed", "Print failed: " + JSON.stringify(err));
    }
}



 get grandTotal(): number {
    return this.items.reduce((sum, it) => sum + (it.qty * it.price), 0);
  }


async saveTransaction() {
  if (this.items.length === 0) {
    alert('Bill is empty');
    return;
  }
  const transaction: Transaction = {
    totalAmount: this.grandTotal,
    paymentMethod: this.paymentType,
    items: this.items.map(it => ({
      itemId: it.id,
      quantity: it.qty,
      priceAtSale: it.price
    }))
  };

  console.log('📦 Sending transaction:', transaction);

  (await this.transactionService.saveTransaction(transaction))
    .subscribe({
      next:async  (res) => {
        console.log('✅ Transaction saved:', res);
        alert('Transaction saved successfully');
          // Only print if checkbox is checked
          if (this.shouldPrint) {
             await this.showPopup("🖨️ Info", "Printing receipt now...");
            await this.printReceipt();
          }
        this.items = []; // clear current bill
      },
      error: (err) => {
        console.error('❌ Save failed:', err);
        alert('Failed to save transaction');
      }
    });
  
}

}
