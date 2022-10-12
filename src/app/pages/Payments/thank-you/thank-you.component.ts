import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { NavService } from 'src/app/services/Navigation/nav.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss'],
})
export class ThankYouComponent implements OnInit {
OrderID;
  constructor(
    public helper:HelperService,
    public nav:NavService,
    public modal:ModalController
  ) {
    this.OrderID=this.helper.getOrderID();
   }


  ngOnInit() {}

  TrackOrder(id){
    this.nav.goto_trackorder(id);
    this.modal.dismiss();
  }

  GotoBizdash(){
    this.nav.goto_bizdash();
    this.modal.dismiss();
  }

}
