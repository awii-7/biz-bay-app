import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { NavService } from 'src/app/services/Navigation/nav.service';

@Component({
  selector: 'app-admin-dash',
  templateUrl: './admin-dash.page.html',
  styleUrls: ['./admin-dash.page.scss'],
})
export class AdminDashPage implements OnInit {
TotalProposals=0;
TotalUsers=0;
TotalPosts=0;
TotalOrders=0;
TotalPayment=0;
  constructor(
    public nav:NavService,
    public helper:HelperService,
    public api:ApiService
  ) { }

  ngOnInit() {
    this.api.TotalProposal().then((total:any)=>{
      this.TotalProposals=total
    })

    this.api.TotalUser().then((users:any)=>{
      this.TotalUsers=users
    })
    this.api.TotalPosts().then((post:any)=>{
      this.TotalPosts=post
    })
    this.api.TotalOrders().then((order:any)=>{
      this.TotalOrders=order
    })

    
  this.api.TranctionTotal().then((order:any)=>{
    this.TotalPayment=order
  })
}
  


}
