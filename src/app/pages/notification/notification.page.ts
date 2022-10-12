import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, PopoverController } from '@ionic/angular';
import { ShowDetailModalComponent } from 'src/app/components/show-detail-modal/show-detail-modal.component';
import { notifications } from 'src/app/models/notifications';
import { Porposal } from 'src/app/models/proposal';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserDetailPage } from '../user-detail/user-detail.page';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  notAccepted=false;
  Accepted=false;
  Take_Action=false;
  NotificationList=[];
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
  ) 
  {
    // this.GetNotificationList();
  }

  Go_Back(){
    this.location.back();
   

  }

  

  swipeEvent(evt){
    console.log(evt)
  }

  ngOnInit() {
    this.local.get("userData").then((result:any)=>{
  let notification = this.api.getNotificationList();
  notification.snapshotChanges().subscribe(res => {
    this.NotificationList = [];
    let temarr=[];
    res.forEach(item => {
      let a = item.payload.toJSON();
      console.log(item.type);
      a['key'] = item.key;
      temarr.push(a as notifications);
      if (temarr.length != 0) {
        if(result.UserType==1){
        this.NotificationList = temarr.filter(x=>x.BizmanID==result.$key && x.UserType==1);
        }
        else
        {
        this.NotificationList = temarr.filter(x=>x.InfluencerID==result.$key && x.UserType==2);
        }
        // for (let index = 0; index < this.NotificationList.length; index++) {
        //   const notificationid = this.NotificationList[index].key;
        //   const Proposalid = this.NotificationList[index].ProposalID;
        //   if(Proposalid !=undefined){
        //     this.CheckIfProposalExist(Proposalid,notificationid)
        //   }
          
        // }
      }
    })
  })
})

  }

  async ShowInfluencer(InfluencerData){
    this.helper.Modal.postModal=false;
    this.helper.Modal.userModal=true;
    this.helper.Modal.proposalModal=false;


      this.helper.setPerposalData(InfluencerData);
    console.log(InfluencerData)
    const popup=await this.popup.create({
      component:ShowDetailModalComponent,
      cssClass:"my-custom-popover",
      backdropDismiss:true,
      showBackdrop:true,
      mode:'md',
    });
    return await popup.present();  
  }

  async ShowPostModal(Data){
    this.helper.Modal.postModal=true;
    this.helper.Modal.userModal=false;
  this.helper.Modal.proposalModal=false;


    this.helper.setPerposalData(Data);
  console.log("Post Data In Notification"+Data)
  const popup=await this.popup.create({
    component:ShowDetailModalComponent,
    cssClass:"my-custom-popover",
    backdropDismiss:true,
    showBackdrop:true,
    mode:'md',
  });
  return await popup.present();  
}

async ShowProposalModal(Data){
  this.helper.Modal.postModal=false;
  this.helper.Modal.userModal=false;
  this.helper.Modal.proposalModal=true;

  this.helper.setPerposalData(Data);
console.log("Post Data In Notification"+Data)
const popup=await this.popup.create({
  component:ShowDetailModalComponent,
  cssClass:"my-custom-popover",
  backdropDismiss:true,
  showBackdrop:true,
  mode:'md',
});
return await popup.present();  
}

  ShowPost(){
    // alert("I'm Post")
    this.toast.ShowToast("I'm Post",'s');

  }

  ShowPurposal(){
    // alert("I'm Purposal")
    this.toast.ShowToast("I'm Purposal",'s');

  }



Purposal_Action(action:string){
  if(action=="accepted")
  {
    // alert("Purposal Accepted");
    this.toast.ShowToast("Purposal Accepted",'s');

    this.Accepted=true;
    this.Take_Action=true;
  }
  if(action=="rejected")
  {
    // alert("Purposal Rejected");
    this.toast.ShowToast("Purposal Rejected",'e');
    this.notAccepted=true;
    this.Take_Action=true;
  }
}

  //Bootstrap Modal Open event
  showModal=false;
  show() {
    this.showModal = true; // Show-Hide Modal Check
  // Dynamic Data
  }
  //Bootstrap Modal Close event
  hide() {
    this.showModal = false;
  }

  userData:any;
  showInfluencerModal=false;
  GetInfluencer(id){
    this.api.getUserByIds(id).then((user)=>{
      if(user !=undefined)
      {
      this.userData=user
      this.showInfluencerModal=true;
      }
      
    })
  }

  HideInfluencerModal(){
    this.showInfluencerModal=false;
  }


  proposalData:any;
  showProposalModal=false;
  GetProposal(id){
    this.api.getProposalByIds(id).then((Proposal)=>{
      if(Proposal !=undefined)
      {
      this.proposalData=Proposal
      this.showProposalModal=true;
      }
      
    })
  }

  HideProposalModal(){
    this.showProposalModal=false;
  }

  postlData:any;
  showPostModal=false;
  GetPost(id){
    this.api.getPostByIds(id).then((post)=>{
      if(post !=undefined)
      {
      this.postlData=post
      this.showPostModal=true;
      }  
    })
  }

  HidePostModal(){
    this.showPostModal=false;
  }

  CheckIfProposalExist(proposalID,NotificationId){
    this.api.isProposalExist(proposalID).then((proposal)=>{
        if(proposal==null){
        this.deleteNotification(NotificationId);
        //  this.toast.ShowToast("Influencer delete ",'e');
      }
    })
  }

  deleteNotification(id){
    this.api.deleteNotification(id)
  }

  OrderData:any;
  showOrderModal=false;
  GetOrder(id){
    this.api.getOrderByIds(id).then((order)=>{
      if(order !=undefined)
      {
      this.OrderData=order
      this.showOrderModal=true;
      }  
    })
  }

  HideOrderModa(){
    this.showOrderModal=false;
  }





// GetBizmanNotification(){
// this.api.getBizmanNotification().then((data:any)=>{
//   if(data !=undefined){
//     this.NotificationList=data
//   }
// })
// }


// GetInfluencerNotification(){
//   this.api.getInflauncerNotification().then((data:any)=>{
//     if(data !=undefined){
//       this.NotificationList=data
//     }
//   })
//   }

dismiss(key){
this.api.deleteNotification(key)
}

}
