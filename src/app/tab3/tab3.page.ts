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
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Item, ItemService } from '../item-service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [ IonInput,
  IonList,
  IonItemOption,CommonModule, FormsModule, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonSpinner, ExploreContainerComponent],
})
export class Tab3Page {
   items: Item[] = [];
  selectedItem?: Item;
  loading = false;
  searchText = '';
filteredItems: Item[] = [];
 showDropdown = false;

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.fetchItems();
  }

  fetchItems() {
    this.loading = true;
    this.itemService.getItems().subscribe({
      next: (data: Item[]) => {
        this.items = data;
        this.filteredItems = data; // initially show all
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Error fetching items:', err);
        this.loading = false;
      }
    });
  }

 onSearchChange(event: any) {
    const val = event.target.value.toLowerCase();
    this.showDropdown = val.length > 0;
    this.filteredItems = this.items.filter(i =>
      i.itemname.toLowerCase().includes(val)
    );
  }

  // call this on searchbar input
filterItems() {
  const text = this.searchText.toLowerCase();
  this.filteredItems = this.items.filter(i =>
    i.itemname.toLowerCase().includes(text)
  );
}


  selectItem(item: Item) {
    this.selectedItem = item;
    this.searchText = item.itemname;
    this.showDropdown = false;
  }

}
