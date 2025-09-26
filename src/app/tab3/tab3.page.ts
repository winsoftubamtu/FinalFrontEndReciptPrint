// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import {
//   IonContent,
//   IonItem,
//   IonLabel,
//   IonSelect,
//   IonSelectOption,
//   IonSpinner,
//    IonInput,
//   IonList,
//   IonItemOption,
//   IonRow,
//   IonCol,
//   IonButton,
//   IonCard,
//   IonCardHeader,
//   IonCardTitle,
//   IonCardContent,
//   IonGrid,
//   IonSegmentButton,
//   IonHeader,
//   IonTitle,
//   IonToolbar,

  
// } from '@ionic/angular/standalone';
// import { ExploreContainerComponent } from '../explore-container/explore-container.component';
// import { Item, ItemService } from '../item-service';
// import { Transaction, TransactionService } from '../TransactionService ';


// @Component({
//   selector: 'app-tab3',
//   templateUrl: 'tab3.page.html',
//   styleUrls: ['tab3.page.scss'],
//   imports: [IonTitle,IonToolbar,IonHeader, IonSegmentButton, IonCardContent, IonGrid, IonCard, IonCardHeader, IonCardTitle, IonRow, IonCol,IonButton, IonInput,
//   IonList,
//   IonItemOption,CommonModule, FormsModule, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonSpinner, ExploreContainerComponent],
// })
// export class Tab3Page implements OnInit {
//    items: Array<{id:number, name: string, qty: number, price: number }> = [];

//   // search related
//   allItems: Item[] = [];
//   filteredItems: Item[] = [];
//   searchText = '';
//   showDropdown = false;
//   selectedItem?: Item;
// paymentType: string = 'Cash'; // default selected
//   // form input
//   quantity: number | null = null;
//   price: number | null = null;

//   constructor(private itemService: ItemService,
//     private transactionService: TransactionService
//   ) {}

//   ngOnInit() {
//     this.fetchItems();
//   }

//   fetchItems() {
//     this.itemService.getItems().subscribe({
//       next: (data: Item[]) => {
//         this.allItems = data;
//         this.filteredItems = data;
//       },
//       error: (err) => console.error('❌ Error fetching items:', err)
//     });
//   }

//   onSearchChange(event: any) {
//     const val = event.target.value.toLowerCase();
//     this.showDropdown = val.length > 0;
//     this.filteredItems = this.allItems.filter(i =>
//       i.itemname.toLowerCase().includes(val)
//     );
//   }

//   selectItem(item: Item) {
//     this.selectedItem = item;
//     this.searchText = item.itemname;
//         this.price = item.price; // auto-fill price
//     this.showDropdown = false;

//   }

//   addItem() {
//     if (!this.selectedItem || !this.quantity) {
//       alert('Please select item and enter quantity');
//       return;
//     }

//     const existing = this.items.find(it => it.name === this.selectedItem!.itemname);

//     if (existing) {
//       existing.qty += this.quantity;
//     } else {
//       this.items.push({
//          id: this.selectedItem.itemid,
//         name: this.selectedItem.itemname,
//         qty: this.quantity,
//         price: this.selectedItem.price
//       });
//     }

//     // reset form
//     this.selectedItem = undefined;
//     this.searchText = '';
//     this.quantity = null;
//   }

//   increaseQty(index: number) {
//     this.items[index].qty++;
//   }

//   decreaseQty(index: number) {
//     if (this.items[index].qty > 1) {
//       this.items[index].qty--;
//     } else {
//       this.items.splice(index, 1);
//     }
//   }

//   removeItem(idx: number) {
//     this.items.splice(idx, 1);
//   }

//   get grandTotal(): number {
//     return this.items.reduce((sum, it) => sum + (it.qty * it.price), 0);
//   }


//  async saveTransaction() {
//   if (this.items.length === 0) {
//     alert('Bill is empty');
//     return;
//   }
//   const transaction: Transaction = {
//     totalAmount: this.grandTotal,
//     paymentMethod: this.paymentType,
//     items: this.items.map(it => ({
//       itemId: it.id,
//       quantity: it.qty,
//       priceAtSale: it.price
//     }))
//   };

//   console.log('📦 Sending transaction:', transaction);

//   (await this.transactionService.saveTransaction(transaction))
//     .subscribe({
//       next: (res) => {
//         console.log('✅ Transaction saved:', res);
//         alert('Transaction saved successfully');
//         this.items = []; // clear current bill
//       },
//       error: (err) => {
//         console.error('❌ Save failed:', err);
//         alert('Failed to save transaction');
//       }
//     });
// }

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
  IonDatetime,

  
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Item, ItemService } from '../item-service';
import { Transaction, TransactionGet, TransactionService } from '../TransactionService ';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonDatetime,IonTitle,IonToolbar,IonHeader, IonSegmentButton, IonCardContent, IonGrid, IonCard, IonCardHeader, IonCardTitle, IonRow, IonCol,IonButton, IonInput,
  IonList,
  IonItemOption,CommonModule, FormsModule, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonSpinner, ExploreContainerComponent],
})
export class Tab3Page implements OnInit  {
  transactions: TransactionGet[] = [];

  fromDate: string = '';   // ISO string yyyy-MM-dd
  toDate: string = '';

   constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadAllTransactions(); // load all initially
  }

  loadAllTransactions() {
    this.transactionService.getAllTransactions().subscribe({
      next: (data) => this.transactions = data,
      error: (err) => console.error('Error fetching transactions', err)
    });
  }

 loadByDate() {
    if (!this.fromDate || !this.toDate) {
      console.warn('Please select both dates');
      return;
    }
    this.transactionService.getTransactionsByDate(this.fromDate, this.toDate).subscribe({
      next: (data) => this.transactions = data,
      error: (err) => console.error('Error fetching transactions by date', err)
    });
  }


  getTotalAmount(): number {
    return this.transactions.reduce((sum, txn) => sum + txn.totalAmount, 0);
  }

  getCashTotal(): number {
  return this.transactions
    .filter(txn => txn.paymentMethod === 'Cash' || txn.paymentMethod === 'cash')
    .reduce((sum, txn) => sum + txn.totalAmount, 0);
}

getOnlineTotal(): number {
  return this.transactions
    .filter(txn => txn.paymentMethod === 'Online' || txn.paymentMethod === 'online')
    .reduce((sum, txn) => sum + txn.totalAmount, 0);
}

}





