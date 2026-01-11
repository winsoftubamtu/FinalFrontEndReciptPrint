import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonApp, 
   IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonMenuToggle,IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, 
     IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonMenuToggle,
    IonLabel,
    IonRouterOutlet,
  RouterLink   ],
})
export class AppComponent {
  constructor() {}
}
