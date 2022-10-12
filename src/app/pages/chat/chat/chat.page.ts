import { Component, OnInit } from '@angular/core';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ApiService } from '../../../services/api.service';
import { Posts } from 'src/app/models/posts';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { send } from 'process';
import { NotificationService } from 'src/app/services/notification.service';
import { fcm } from 'src/app/models/fcm';

declare var $;
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  postForm: FormGroup;
 RoomID;
 Chat;
 message="";
  constructor(
    public nav:NavService,
    private api: ApiService,
    private router: Router,
    public fb: FormBuilder,
    public helper:HelperService,
    public route:ActivatedRoute,
    public notification:NotificationService
    
  ) { 
    this.helper.PageName="Chat"
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.RoomID = params['roomid']; 
    this.api.getRoomByID(this.RoomID).valueChanges().subscribe(res=>{
      if(res !=undefined){
        this.Chat=res
        if(this.Chat.chat==undefined){
          this.Chat.chat=[]
        }
        
      }

    })
  });

// this.gotoBottom()

  }
  ionViewDidLeave(){
    var scrl = document.getElementById('appCapsule');
    scrl.scrollTo(0, 9999);
    // this.gotoBottom();
  }

   gotoBottom(){
    var element = document.getElementById('appCapsule');
    element.scrollTop = element.scrollHeight - element.clientHeight;
 }


  async sendMessage(){ 
    if(this.message){ 
    let TempCommentArr=[];  
      TempCommentArr= this.Chat.chat==undefined?[]:this.Chat.chat;
      TempCommentArr.push({
        message:this.message,
        fromName:this.helper.userData.FirstName,
        datetime:this.helper.formateDatePK(),
        userid:this.helper.userData.UserType==="1"?this.Chat.BizmanID:this.Chat.InfluencerID,
        msgid:this.helper.GenerateUniqueID(),
        
      })
      let obj={
        chat:TempCommentArr,
        ModefiedDateTime:this.helper.formateDatePK(),
      }
      this.message="";
      this.api.SendMessage(this.RoomID,obj).then((data)=>{
        this.send(TempCommentArr);
      })
    }
  }

  send(data){
    let last=data[data.length-1]
    this.token().then((t:string)=>{
      
      let fcm:fcm={
        title:last.fromName,
        body:last.message,
        token:t,
        page:"chat",
        id:this.RoomID
      }
    this.notification.MessageNotification(fcm)
    })
   
  }
   
   
  Token:"";
token(){
  return new Promise((resolve,reject)=>{
    let key= this.helper.userData.UserType==="1"?this.Chat.InfluencerID:this.Chat.BizmanID
    this.api.getToken(key).then((token)=>{
      if(token !=undefined){
        return resolve(token)
      }
    })
  })

}


}
