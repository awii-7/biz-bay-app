import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, PopoverController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Location } from '@angular/common';
import { order } from 'src/app/models/orders';
import * as moment from 'moment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  OrderList=[]
  segment=""
  constructor(
    public local:LocalStorageService,
    public api:ApiService,
    public nav:NavService,
    public helper:HelperService,
    private menu:MenuController,
    private toast:ToastService,
    private modal:ModalController,
    private popup:PopoverController,
    private location:Location
  ) {
    this.segment="active"
   }

  ngOnInit() {
    this.local.get("userData").then((result:any)=>{
  let order = this.api.getOrderList();
  order.snapshotChanges().subscribe(res => {
    this.OrderList = [];
    let temarr=[];
    res.forEach(item => {
      let a = item.payload.toJSON();
      a['key'] = item.key;
      if(a['ProgressPercentage']<=99){
      let RemainingDateTime=this.DaysRemain(a['OrderCreatedDateTime'],a['DeleveryDate'])
      this.api.updateOrderDays(item.key,RemainingDateTime);
      }
      temarr.push(a as order);
      if(temarr.length >0 && result.UserType=="1"){
        this.OrderList=temarr.filter(x=>x.BizmanID==result.$key && x.isActive===true);
      }
      else if(temarr.length >0 && result.UserType=="2"){
        this.OrderList=temarr.filter(x=>x.InfluencerID==result.$key && x.isActive===true);
      }
      })
    })
  })
}

segmentChanged(evt){

}

DaysRemain(date1,date2){
  var datetime=moment().format('DD-MM-YYYY hh:mm:ss A');
  var today = moment(datetime, "DD-MM-YYYY hh:mm:ss A");
  var start = moment(date1, "DD-MM-YYYY hh:mm:ss A");
  var end = moment(date2, "DD-MM-YYYY hh:mm:ss A");

  var time_remaining=moment(date2, "DD-MM-YYYY hh:mm:ss A").fromNow();



      //Difference in number of days
var NumberOfDays= moment.duration(end.diff(today)).asDays().toFixed(0)

  //Difference in number of minutes
var NumberOfMinutes= moment.duration(end.diff(today)).asMinutes();

  //Difference in number of hours
  var NumberOfHours= moment.duration(end.diff(today)).asHours();

  //Difference in number of weeks
  var NumberOfWeeks= moment.duration(end.diff(today)).asWeeks();

    //Difference in number of months
var NumberOfMonths= moment.duration(end.diff(today)).asMonths();

  //Difference in number of years
  var NumberOfYears= moment.duration(end.diff(today)).asYears();

return time_remaining;

}

}
