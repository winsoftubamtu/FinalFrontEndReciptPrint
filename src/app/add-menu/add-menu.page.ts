import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonMenuButton,IonButtons, IonButton,
    IonItem,
    IonInput,
    IonLabel,
    IonGrid,
    IonRow,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCol,
  IonCardContent, IonIcon,AlertController  } from '@ionic/angular/standalone';
import { BillLocalService } from '../bill-local-service';
import { StorageService } from '../storage.service';
import { Item, ItemService } from '../item-service';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.page.html',
  styleUrls: ['./add-menu.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton,
  IonItem,
  IonInput,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,IonMenuButton,IonButtons, FormsModule, IonButton,
    IonItem,
    IonInput,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol]
})
export class AddMenuPage implements OnInit {
  storeName: string = '';
  items: Item[] = [];

  // form model (UI only)
  itemName: string = '';
  price: number | null = null;
  constructor(private storageService: StorageService,
          private billLocalService: BillLocalService,
        private itemService: ItemService,
        private alertCtrl: AlertController   // 👈 IMPORTANT
) { }

 async ngOnInit() {
    this.loadItems();
    await this.billLocalService.init();
      await this.storageService.init();
      this.storeName = (await this.storageService.get('storeName')) ?? '';

  }

  
  async ionViewWillEnter() {
    await this.storageService.init();
    this.storeName = (await this.storageService.get('storeName')) ?? '';
  }
  loadItems() {
    this.itemService.getItems().subscribe({
      next: (res) => {
        this.items = res;
        console.log('Items loaded:', res);
      },
      error: (err) => {
        console.error('Error loading items', err);
      }
    });
  }
// addItem() {
//   if (!this.itemName || this.price === null) return;

//   this.itemService.addItem({
//     itemname: this.itemName,
//     price: this.price
//   }).subscribe(() => {
//     this.itemName = '';
//     this.price = null;
//     this.loadItems();
//   });
// }

// editItem(item: Item) {
//   const alert = document.createElement('ion-alert');
//   alert.header = 'Edit Item';
//   alert.inputs = [
//     { name: 'itemname', value: item.itemname },
//     { name: 'price', type: 'number', value: item.price }
//   ];
//   alert.buttons = [
//     { text: 'Cancel', role: 'cancel' },
//     {
//       text: 'Update',
//       handler: (data) => {
//         this.itemService.updateItem(item.itemid, {
//           itemname: data.itemname,
//           price: +data.price
//         }).subscribe(() => this.loadItems());
//       }
//     }
//   ];
//   document.body.appendChild(alert);
//   alert.present();
// }

addItem() {
  if (!this.itemName || this.price === null) return;

  this.itemService.addItem({
    itemname: this.itemName,
    price: this.price
  }).subscribe({
    next: () => {
      this.itemName = '';
      this.price = null;
      this.loadItems();   // ✅ refresh
    },
    error: err => console.error(err)
  });
}


async editItem(item: Item) {
  const alert = await this.alertCtrl.create({
    header: 'Edit Item',
    inputs: [
      {
        name: 'itemname',
        type: 'text',
        value: item.itemname,
        placeholder: 'Item name'
      },
      {
        name: 'price',
        type: 'number',
        value: item.price,
        placeholder: 'Price'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Update',
        handler: (data) => {
          this.itemService.updateItem(item.itemid, {
            itemname: data.itemname,
            price: Number(data.price)
          }).subscribe(() => this.loadItems());
        }
      }
    ]
  });

  await alert.present();
}

deleteItem(id: number) {
  this.itemService.deleteItem(id).subscribe({
    next: () => this.loadItems(),
    error: err => console.error(err)
  });
}

async confirmDelete(id: number) {
  const alert = await this.alertCtrl.create({
    header: 'Delete Item',
    message: 'Are you sure you want to delete this item?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          this.deleteItem(id);
        }
      }
    ]
  });

  await alert.present();
}


}
