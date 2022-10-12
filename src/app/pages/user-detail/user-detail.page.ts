import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { Platform } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Rooms } from 'src/app/models/rooms';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {
  userID;
  userDetail:any={}
  userRanking={
    Rating:0.0,
    TotalOrder:0,
    TotalStars:0
  }
  constructor(
    private route:ActivatedRoute,
    private api:ApiService,
    private nav:NavService,
    // private platform:Platform
    public status:StatusBar,
    public local:LocalStorageService,
    public helper:HelperService
  ) 
  { 
    status.backgroundColorByHexString('#C0C0C0');
    this.route.params.subscribe(params => {
      this.userID = params['userid']; 

    this.api.getUserById(this.userID).valueChanges().subscribe(res=>{
      if(res !=undefined){
        this.userDetail=res
        // this.GetRanking();
      }

    })
  });

  }

  ngOnInit() {
   
  }

  GetRanking(){
    this.api.GetRanking(this.userID).then(u => {
      let usr: any = u;
      if(usr !=false){
        let key:any=Object.keys(usr)[0];
        let user=usr[key];
        this.userRanking=user
      }

  })
}

sendMessage(){
  this.isRoomExist().then((result)=>{
    if(result==true){
    this.local.get("AuthKey").then((key)=>{
      if(key){
        let obj:Rooms={
          BizmanID:key,
          CreatedDateTime:this.helper.formateDatePK(),
          ModefiedDateTime:"",
          isActive:true,
          BizmanName:this.helper.userData.FirstName +" "+this.helper.userData.LastName,
          InfluencerName:this.userDetail.FirstName+" "+this.userDetail.LastName,
          InfluencerID:this.userID,
          chat:[]
        }
        this.api.CreateRoom(obj).then((data)=>{
          if(data !=undefined){
            this.nav.openChat(data);
          }
        })
      }
    })
  }
  else
  {
    this.nav.openChat(result);
  }
  });


}

isRoomExist():Promise<any>{
  return new Promise((resolve,reject)=>{

    this.api.isRoomExist(this.userID).then((data)=>{
      if(data==false){
        return resolve(true)
      }
      else
      {
        return resolve(data)
      }
  })

  });
}

}

