import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, MenuController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { NavService } from 'src/app/services/Navigation/nav.service';

@Component({
  selector: 'app-e-wallet',
  templateUrl: './e-wallet.page.html',
  styleUrls: ['./e-wallet.page.scss'],
})
export class EWalletPage implements OnInit {
MyWallet=0;
  constructor(
    public pop: PopoverController,
    public route: Router,
    public nav: NavService,
    public helper: HelperService,
    public api: ApiService,
    public menu: MenuController,
  ) { }

  ngOnInit() {
   this.api.isWalletExist(this.helper.userData.$key).then((data)=>{
if(data){
  this.MyWallet=data.Balance
}
else
{
  this.MyWallet=0
}
   }) 
  }

}
