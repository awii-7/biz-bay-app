import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, MenuController } from '@ionic/angular';
import { Rooms } from 'src/app/models/rooms';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-messagelist',
  templateUrl: './messagelist.page.html',
  styleUrls: ['./messagelist.page.scss'],
})
export class MessagelistPage implements OnInit {
  SearchMessage=""
  Rooms=[]
  constructor(
    public nav:NavService,
    private api: ApiService,
    private router: Router,
    public fb: FormBuilder,
    public helper:HelperService,
    public menu:MenuController,
    public local:LocalStorageService,
    public toast:ToastService,
    public alertCtrl:AlertController,
    public actionCtrl:ActionSheetController
  ) { }

  ngOnInit() {
    this.local.get("userData").then((result)=>{
      if(result !=undefined || result !=null){
    let rooms = this.api.getRoomList();
    rooms.snapshotChanges().subscribe(res => {
      this.Rooms = [];
     let tempArr=[]
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['key'] = item.key;
        tempArr.push(a as Rooms);

 

        if(result.UserType==="1"){
          this.Rooms=tempArr.filter(x=>x.BizmanID===result.$key)
          this.Rooms.sort(function(a, b){
            return new Date(b.ModefiedDateTime).valueOf() - new Date(a.ModefiedDateTime).valueOf(); 
            // if(a.CreatedDateTime < b.CreatedDateTime) { return -1; }
            // if(a.CreatedDateTime > b.CreatedDateTime) { return 1; }
            // return 0;
          });
        }
        else if(result.UserType==="2")
        {
          this.Rooms=tempArr.filter(x=>x.InfluencerID===result.$key)
        }



        // this.Posts.sort(function(a,b){
        //   return b.ViewCount - a.ViewCount
        // });
      })
    
    })
  }
  })

  }
  intervalss=400;
  SideMnu() {
    this.menu.toggle();
  }

  openChat(key){
    this.nav.openChat(key);
  }

  LastMessage(i){
    let current=this.Rooms[i];
    if(current !=undefined){
     let c=current.chat[Object.keys(current.chat).length-1].message
     if(c !=undefined || c !=null){
      return c;
     }
    }
  }

  deleteConversation(id){
    this.api.deleteConversation(id);
    this.toast.ShowToast("conversation Deleted","s");
  }

  async ConfirmDelete(id) {
    let alert =await this.alertCtrl.create({
      header:"Confirm Delete",
      message: 'Do you want to delete conversation?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteConversation(id)
            console.log('delete clicked');
          }
        }
      ]
    });
    alert.present();
  }

  async presentActionSheet(id) {

    let actionSheet =await this.actionCtrl.create({
      
      buttons: [
       
        
        {
          text: 'Delete conversation',
          icon:"trash-outline",
          handler: () => {
            // this.imageCapturedGallery();
            // this.presentAlert(id)
            this.ConfirmDelete(id)
          },
         
  
        },
      ]
    });
    actionSheet.present();
  
  }

  Delete(){
    for (let index = 0; index < this.Rooms.length; index++) {
      let d=this.helper.formateDat(this.Rooms[index].CreatedDateTime);
      let now=new Date().getMinutes()-1;
        if(this.Rooms[index].chat==undefined && now >d){
          this.deleteConversation(this.Rooms[index].key);
        }
      
    }
  }

}

