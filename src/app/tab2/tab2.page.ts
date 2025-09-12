import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonContent, IonButton, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonList,IonItem,IonLabel, ExploreContainerComponent],
   providers: [BluetoothSerial, AndroidPermissions]
})
export class Tab2Page implements OnInit {
devices: any[] = [];
  selectedDevice: any = null;
  statusMessage: string = '';
  constructor(
     private bluetoothSerial: BluetoothSerial,
    private androidPermissions: AndroidPermissions
  ) { }

  ngOnInit() {
  }

  enableBluetooth() {
    this.bluetoothSerial.enable().then(() => {
      this.statusMessage = 'Bluetooth enabled';
    }).catch(err => {
      this.statusMessage = 'Error enabling Bluetooth: ' + err;
    });
  }

  listDevices() {
    this.bluetoothSerial.list().then((allDevices) => {
      this.devices = allDevices;
    }).catch(err => {
      this.statusMessage = 'Error listing devices: ' + err;
    });
  }

  connect(device: any) {
    this.bluetoothSerial.connect(device.address).subscribe(success => {
      this.selectedDevice = device;
      this.statusMessage = 'Connected successfully!';
    }, error => {
      this.statusMessage = 'Connection failed: ' + error;
    });
  }
}
