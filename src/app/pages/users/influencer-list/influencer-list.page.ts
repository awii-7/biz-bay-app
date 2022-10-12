import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, MenuController } from '@ionic/angular';
import { UsersRegistration } from 'src/app/models/usersRegistration';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { NavService } from 'src/app/services/Navigation/nav.service';

@Component({
  selector: 'app-influencer-list',
  templateUrl: './influencer-list.page.html',
  styleUrls: ['./influencer-list.page.scss'],
})
export class InfluencerListPage implements OnInit {

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
          this.Users = tempArr.filter(x => x.UserType === "2" && x.IsActive==="1");
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
    this.CurrentDateTime=this.helper.formateDatePK();
  
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

  // GetTotalStars(id) {
  //   let Stars = this.userRanking.filter(x => x.InflauncerID == id)[0];
  //   if (Stars != undefined) {
  //     return Stars.TotalStars;
  //   }
  //   else {
  //     return "0";
  //   }
  // }

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

}
