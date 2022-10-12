import { Component, OnInit } from '@angular/core';
import { MenuController, PopoverController } from "@ionic/angular";

import { Router } from '@angular/router';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { UsersRegistration } from 'src/app/models/usersRegistration';
import { ApiHelperService } from 'src/app/services/api-helper.service';
import { ApiService } from 'src/app/services/api.service';
import { Ranking } from 'src/app/models/userRanking';


@Component({
  selector: 'app-bizdash',
  templateUrl: './bizdash.page.html',
  styleUrls: ['./bizdash.page.scss'],
})
export class BizdashPage implements OnInit {
  a={
    rating:false,
    order:false,
    follower:false,
  }
  userData;
  Users = [];
  userRanking = [];
  hideMe = true;
  ranking = this.api.getRankingList();
  Greeting:string;
  constructor(
    public pop: PopoverController,
    public route: Router,
    public nav: NavService,
    public helper: HelperService,
    public api: ApiService,
    public menu: MenuController,

  ) {
    this.helper.PageName = "Business Dash";
    this.a.rating=true
    this.startTime()
    this.Greeting=this.helper.generateGreetings()

  }

  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };
CurrentDateTime:string;
  ngOnInit() {
    this.api.NotifBadge();
    let userRes = this.api.getInflauncerList();
  
    userRes.snapshotChanges().subscribe(res => {
      this.Users = [];
      let tempArr = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        tempArr.push(a as UsersRegistration);
        if (tempArr.length != 0) {
          this.Users = tempArr.filter(x => x.UserType == 2);
          this.Users.sort(function(a, b){
            // console.table(b.Rating - a.Rating);
            return b.Rating - a.Rating
          });

        }
      })
    })
    // this.ranking.snapshotChanges().subscribe(result => {
    //   this.userRanking = [];
    //   let tempArr = [];
    //   result.forEach(item => {
    //     let a = item.payload.toJSON();
    //     a['$key'] = item.key;
    //     this.userRanking.push(a as Ranking);
    //   })
    // })
    // this.helper.getUserdata();
    // this.CurrentDateTime=this.helper.formateDatePK();
    this.GetTotalUser();
    this.GetTotalProposal();
  }

  GetRanking(user) {

    this.api.GetRanking(user).then(u => {
      let usr: any = u;
      if (usr != false) {
        let key: any = Object.keys(usr)[0];
        let user = usr[key];
        this.userRanking = user
      }

    })
  }

  NCount=0;
  NotifBadge(){
    this.api.GetNotificationCount().then((data:any)=>{
      if(data){
this.NCount=data;
      }
      else if(!data){
        this.NCount=0;
      }

    })
  }

  TotalInfluencer=0;
  GetTotalUser() {
    this.api.GetTotalInfluencer().then((data:any)=>{
      if (data) {
   this.TotalInfluencer=data;
      }
      else if(data==false) {
        return "0";
      }
    })

  }

  TotalProposal=0;
  GetTotalProposal() {
    this.api.GetTotalProposalCount(this.helper.userData.$key).then((data:any)=>{
      if (data) {
   this.TotalProposal=data;
      }
      else if(data==false) {
        return "0";
      }
    })

  }

  // GetRating(id) {
  //   let Rating = this.userRanking.filter(x => x.InflauncerID == id)[0];
  //   if (Rating != undefined) {
  //     return Rating.Rating;
  //   }
  //   else {
  //     return "0.0"
  //   }
  // }

  // GetOrder(id) {
  //   let Order = this.userRanking.filter(x => x.InflauncerID == id)[0];
  //   if (Order != undefined) {
  //     return Order.TotalOrder;
  //   }
  //   else {
  //     return "0";
  //   }
  // }




  // CreatePopover(event)
  //  {
  //    this.pop.create({component:ProfilepopPage,
  //    showBackdrop:false,
  //    cssClass:"custom-popover"


  //   }).then((popoverElement)=>{
  //      popoverElement.present();
  //    })
  //  }



  // async presentPopover(ev: any) {
  //   const popover = await this.pop.create({
  //     component:ProfilemenuComponent,
  //     cssClass: 'my-custom-class',
  //     event: ev,
  //     translucent: true
  //   });
  //   return await popover.present();
  // }

  // doClick(){
  //   this.menu.toggle();
  // }

  goto_Instagram(username) {
    if (username != "") {
      window.open('https://www.instagram.com/' + username);
    }
    else {
      alert("Username not found");
    }
  }

  SideMnu() {
    this.menu.toggle();
  }

  rate=false;
  filterRating(){
    this.rate=true;
  }
  
  FilterbyStars() {
  this.userRanking.sort(function(a, b){
    console.table(b.Rating - a.Rating);
    return b.Rating - a.Rating
  });
  }
 
  Filter_Inflauncer(type:string){
    if(type=="rating"){
      this.Users.sort(function(a, b){
        console.table(b.Rating - a.Rating);
        return b.Rating - a.Rating
      });
      this.a={
        rating:true,
        order:false,
        follower:false,
      }
  }
  if(type=="order"){
    this.Users.sort(function(a, b){
      console.table(b.Rating - a.Rating);
      return b.OrderCount - a.OrderCount
    });
    this.a={
      rating:false,
      order:true,
      follower:false,
    }
  }
  if(type=="followers"){
    this.Users.sort(function(a, b){
      console.table(b.Rating - a.Rating);
      return b.followercount - a.followercount
    });
    this.a={
      rating:false,
      order:false,
      follower:true,
    }
  }
  }

   showTime(){
    var date = new Date();
    var h:any = date.getHours(); // 0 - 23
    var m:any = date.getMinutes(); // 0 - 59
    var s:any = date.getSeconds(); // 0 - 59
    var session = "AM";
    
    if(h == 0){
        h = 12;
    }
    
    if(h > 12){
        h = h - 12;
        session = "PM";
    }
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    var time = h + ":" + m + ":" + s + " " + session;
    document.getElementById("MyClockDisplay").innerText = time;
    document.getElementById("MyClockDisplay").textContent = time;
    
    setTimeout(this.showTime, 1000);
    
}
time;
startTime() {
  setInterval(function () {
    let t = new Date().toLocaleTimeString();
    this.time = this.tConvertAM_PM(t);

  }.bind(this), 1000)

}

tConvertAM_PM(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice(1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(''); // return adjusted time or original string
}


}
