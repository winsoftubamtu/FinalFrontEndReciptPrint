
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import {
//   IonContent,
//   IonHeader,
//   IonTitle,
//   IonToolbar,
//   IonButtons,
//   IonMenuButton,
//   IonButton,
//   IonItem,
//   IonLabel,
//   IonInput,
//   IonCard,
//   IonCardHeader,
//   IonCardTitle,
//   IonCardContent,
//   IonList,
//   IonSpinner
// } from '@ionic/angular/standalone';

// import { BillLocalService } from '../bill-local-service';
// import { StorageService } from '../storage.service';
// import { TransactionService,TransactionGet  } from '../TransactionService ';

// interface ItemSummary {
//   itemId: number;
//   itemName: string;
//   totalQty: number;
//   totalRevenue: number;
// }

// @Component({
//   selector: 'app-profit-loss',
//   templateUrl: './profit-loss.page.html',
//   styleUrls: ['./profit-loss.page.scss'],
//   standalone: true,
//   imports: [
//     IonContent,
//     IonHeader,
//     IonTitle,
//     IonToolbar,
//     IonButtons,
//     IonMenuButton,
//     IonButton,
//     IonItem,
//     IonLabel,
//     IonInput,
//     IonCard,
//     IonCardHeader,
//     IonCardTitle,
//     IonCardContent,
//     IonList,
//     CommonModule,
//     FormsModule,
//     IonSpinner
//   ]
// })
// export class ProfitLossPage implements OnInit {

//   storeName = '';

//   fromDate = '';
//   toDate = '';

//   itemSummary: ItemSummary[] = [];

//   totalSalesAmount = 0;
//   totalItemsSold = 0;

//   loading = false;

//   constructor(
//     private storageService: StorageService,
//     private billLocalService: BillLocalService,
//     private transactionService: TransactionService
//   ) {}

//   async ngOnInit() {
//     await this.billLocalService.init();
//     await this.storageService.init();
//     this.storeName = (await this.storageService.get('storeName')) ?? '';
//   }

//   fetchReport() {
//     if (!this.fromDate || !this.toDate) return;

//     this.loading = true;
//     this.itemSummary = [];
//     this.totalSalesAmount = 0;
//     this.totalItemsSold = 0;

//     this.transactionService
//       .getTransactionsByDate(this.fromDate, this.toDate)
//       .subscribe({
//         next: (transactions) => {
//           this.processTransactions(transactions);
//           this.loading = false;
//         },
//         error: (err) => {
//           console.error(err);
//           this.loading = false;
//         }
//       });
//   }

//   private processTransactions(transactions: TransactionGet[]) {
//     const map = new Map<number, ItemSummary>();

//     transactions.forEach(tx => {
//       this.totalSalesAmount += tx.totalAmount;

//       tx.items.forEach(item => {
//         this.totalItemsSold += item.quantity;

//         if (!map.has(item.itemId)) {
//           map.set(item.itemId, {
//             itemId: item.itemId,
//             itemName: item.itemName,
//             totalQty: 0,
//             totalRevenue: 0
//           });
//         }

//         const summary = map.get(item.itemId)!;
//         summary.totalQty += item.quantity;
//         summary.totalRevenue += item.quantity * item.priceAtSale;
//       });
//     });

//     this.itemSummary = Array.from(map.values())
//       .sort((a, b) => b.totalQty - a.totalQty); // top-selling first
//   }
// }




import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

import { Share } from '@capacitor/share';
import { Toast } from '@capacitor/toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonMenuButton, IonButton, IonItem,
  IonLabel, IonInput, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonGrid, IonRow,
  IonCol, IonSpinner, IonProgressBar, IonList
} from '@ionic/angular/standalone';

import { BillLocalService } from '../bill-local-service';
import { StorageService } from '../storage.service';
 import { TransactionService,TransactionGet  } from '../TransactionService ';
//import { TransactionService, TransactionGet } from '../transaction-service';

interface ItemSummary {
  itemId: number;
  itemName: string;
  totalQty: number;
  totalRevenue: number;
}

interface DailySales {
  date: string;
  amount: number;
}

@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.page.html',
  styleUrls: ['./profit-loss.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonMenuButton, IonButton, IonItem,
    IonLabel, IonInput, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent, IonGrid, IonRow,
    IonCol, IonSpinner, IonProgressBar, IonList
  ]
})
export class ProfitLossPage implements OnInit {

  storeName = '';

  fromDate = '';
  toDate = '';

  loading = false;

  // SUMMARY
  totalSalesAmount = 0;
  totalItemsSold = 0;
  cashSales = 0;
  onlineSales = 0;

  // ITEM DATA
  itemSummary: ItemSummary[] = [];
  lowSellingItems: ItemSummary[] = [];
  maxQuantity = 1;

  // DAILY SALES
  dailySales: DailySales[] = [];

  constructor(
    private storageService: StorageService,
    private billLocalService: BillLocalService,
    private transactionService: TransactionService
  ) {}

  async ngOnInit() {
    await this.billLocalService.init();
    await this.storageService.init();
    this.storeName = (await this.storageService.get('storeName')) ?? '';
  }
  
  async ionViewWillEnter() {
    await this.storageService.init();
    this.storeName = (await this.storageService.get('storeName')) ?? '';
  }

  fetchReport() {
    if (!this.fromDate || !this.toDate) return;

    this.resetData();
    this.loading = true;

    this.transactionService
      .getTransactionsByDate(this.fromDate, this.toDate)
      .subscribe({
        next: (transactions) => {
          this.processTransactions(transactions);
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  private resetData() {
    this.totalSalesAmount = 0;
    this.totalItemsSold = 0;
    this.cashSales = 0;
    this.onlineSales = 0;
    this.itemSummary = [];
    this.lowSellingItems = [];
    this.dailySales = [];
  }

  private processTransactions(transactions: TransactionGet[]) {
    const itemMap = new Map<number, ItemSummary>();
    const dailyMap = new Map<string, number>();

    transactions.forEach(tx => {
      this.totalSalesAmount += tx.totalAmount;

      // PAYMENT SPLIT
      if (tx.paymentMethod === 'Cash') {
        this.cashSales += tx.totalAmount;
      } else {
        this.onlineSales += tx.totalAmount;
      }

      // DAILY SALES
      const date = tx.createdAt.split('T')[0];
      dailyMap.set(date, (dailyMap.get(date) || 0) + tx.totalAmount);

      // ITEM SALES
      tx.items.forEach(item => {
        this.totalItemsSold += item.quantity;

        if (!itemMap.has(item.itemId)) {
          itemMap.set(item.itemId, {
            itemId: item.itemId,
            itemName: item.itemName,
            totalQty: 0,
            totalRevenue: 0
          });
        }

        const s = itemMap.get(item.itemId)!;
        s.totalQty += item.quantity;
        s.totalRevenue += item.quantity * item.priceAtSale;
      });
    });

    this.itemSummary = Array.from(itemMap.values())
      .sort((a, b) => b.totalQty - a.totalQty);

    this.lowSellingItems = this.itemSummary.filter(i => i.totalQty <= 3);

    this.maxQuantity = this.itemSummary[0]?.totalQty || 1;

    this.dailySales = Array.from(dailyMap.entries()).map(([date, amount]) => ({
      date,
      amount
    }));
  }

 async  downloadReport() {
  const doc = new jsPDF('p', 'mm', 'a4');

  // ---------- HEADER ----------
  doc.setFontSize(16);
  doc.text(this.storeName || 'Store Report', 14, 15);

  doc.setFontSize(10);
  doc.text(
    `From: ${this.fromDate}   To: ${this.toDate}`,
    14,
    22
  );

  // ---------- SUMMARY ----------
  autoTable(doc, {
    startY: 28,
    head: [['Summary', 'Value']],
    body: [
      ['Total Sales', `Rs ${this.totalSalesAmount}`],
      ['Total Items Sold', `${this.totalItemsSold}`],
      ['Cash Sales', `Rs ${this.cashSales}`],
      ['Online Sales', `Rs ${this.onlineSales}`]
    ],
    theme: 'grid',
    styles: { fontSize: 10 }
  });

  // ---------- ITEM-WISE SALES ----------
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 8,
    head: [['Item Name', 'Quantity Sold', 'Revenue']],
    body: this.itemSummary.map(item => [
      item.itemName,
      item.totalQty,
      `Rs ${item.totalRevenue}`
    ]),
    theme: 'striped',
    styles: { fontSize: 9 }
  });

  // ---------- DAILY SALES ----------
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 8,
    head: [['Date', 'Total Sales']],
    body: this.dailySales.map(d => [
      d.date,
      `Rs ${d.amount}`
    ]),
    theme: 'grid',
    styles: { fontSize: 9 }
  });

  // // ---------- DOWNLOAD ----------
  // const fileName = `Profit_Loss_${this.fromDate}_to_${this.toDate}.pdf`;
  // doc.save(fileName);

  const fileName = `Profit_Loss_${this.fromDate}_to_${this.toDate}.pdf`;

  // ---------- WEB ----------
  // if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
  //   doc.save(fileName);
  //   return;
  // }

  // ---------- ANDROID ----------
  const pdfBase64 = doc.output('datauristring').split(',')[1];
const base64Data = pdfBase64; // already base64, no prefix
const perm = await Filesystem.checkPermissions();

if (perm.publicStorage !== 'granted') {
  await Filesystem.requestPermissions();
}
  // Save to Downloads
 await Filesystem.writeFile({
  path: `Profit_Loss_${this.fromDate}_to_${this.toDate}.pdf`,
  data: base64Data,
  directory: Directory.External,
  recursive: true
});

  // Get file URI
  const fileUri = await Filesystem.getUri({
    directory: Directory.Documents,
    path: fileName
  });

  // Toast message
  await Toast.show({
    text: 'PDF saved to Documents',
    duration: 'short',
    position: 'bottom'
  });

  // Auto-open / share
  await Share.share({
    title: 'Profit & Loss Report',
    text: 'Your report is ready',
    files: [fileUri.uri]
  });
}

}
