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

  
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Item, ItemService } from '../item-service';


//import { IonButton, IonCol, IonRow } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonSegmentButton, IonCardContent, IonGrid, IonCard, IonCardHeader, IonCardTitle, IonRow, IonCol,IonButton, IonInput,
  IonList,
  IonItemOption,CommonModule, FormsModule, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonSpinner, ExploreContainerComponent],
})
export class Tab3Page implements OnInit {
   items: Array<{ name: string, qty: number, price: number }> = [];

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

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.fetchItems();
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

  get grandTotal(): number {
    return this.items.reduce((sum, it) => sum + (it.qty * it.price), 0);
  }

  printReceipt(){

  }

}
