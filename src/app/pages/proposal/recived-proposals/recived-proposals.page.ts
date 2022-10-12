import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, ModalController, PopoverController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Location } from '@angular/common';
import { ShowDetailModalComponent } from 'src/app/components/show-detail-modal/show-detail-modal.component';
import { order } from 'src/app/models/orders';
import { notifications } from 'src/app/models/notifications';
import * as moment from 'moment';
import { AddCardComponent } from 'src/app/components/add-card/add-card.component';

@Component({
  selector: 'app-recived-proposals',
  templateUrl: './recived-proposals.page.html',
  styleUrls: ['./recived-proposals.page.scss'],
})
export class RecivedProposalsPage implements OnInit {
  ProposalList = [];
  TempProposalList=[];
  segment;

  notAccepted=false;
  Accepted=false;
  Take_Action=false;
  OrderID="";
  constructor(
    public local:LocalStorageService,
    public api:ApiService,
    public nav:NavService,
    public helper:HelperService,
    private menu:MenuController,
    private toast:ToastService,
    private modal:ModalController,
    private popup:PopoverController,
    private location:Location,
    public alert:AlertController
  ) {
    this.segment='all';
   }

  ngOnInit() {
    this.local.get("AuthKey").then(key=>{
      if(key !=undefined){
      let proposal=this.api.getProposalList();
      proposal.snapshotChanges().subscribe(res => {
          this.ProposalList= [];
          this.TempProposalList=[];
          res.forEach(item => {
            let a = item.payload.toJSON();
            a['key'] = item.key;
              this.TempProposalList.push(a);
              if(this.TempProposalList.length !=0){
                this.ProposalList=this.TempProposalList.filter(x=>x.Post_Created_By.key==key && x.isActive===true);
              }
          })
        })
      }
  })
}
  

  
segmentChanged(evt){

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

activeClass(key){
  if(key==this.helper.activeProposal){
    return "bgcolor !important"
  }
  else
  {
    return "transparent !important"
  }
}

MakeOrder(index){
  let order:order;
 let orderno= this.api.GenerateOrderNo();
 let orderDate= this.helper.formateDatePK()
if(index !=undefined){
  let data=this.ProposalList[index];
  console.log(data)
  order={
    $key:"",
    DeleveryDate:this.helper.addDaystoCurrentDate(data.Order_Delever_Days),
    ModifiedOn:"",
    OrderCreatedDateTime:orderDate,
    Price:data.Price.toString(),
    ProgressPercentage:"0",
    RemainingDateTime:"",
    OrderNo:orderno,
    Title:"Your Order Generated",
    isActive:true,
    isDeleted:false,
    BizmanID:data.Post_Created_By.key,
    BizmanName:data.Post_Created_By.FirstName+" "+data.Post_Created_By.LastName,
    Comments:[{
      message:"Order Generated Successfully",
      datetime:this.helper.formateDatePK(),
      completed:"0"
    }],
    InfluencerID:data.Porposal_Sent_By.key,
    InfluencerName:data.Porposal_Sent_By.FirstName +" "+data.Porposal_Sent_By.LastName,
    PostID:data.Porposal_on_Post.key,
    ProposalID:data.key,
    Status:'C',
    DeleverInDays:data.Order_Delever_Days,
    WaitingForReview:false,
    isReviewed:false,
    isSubmited:false
  }
  this.helper.setOrderData(order);
  this.nav.goto_payorder();
  // this.api.GenerateOrder(order).then((d:any)=>{
  //   if(d){
  //     this.OrderID=d
  //     this.api.UpdateProposal(order.ProposalID,"C");
  //     this.SaveBizmanNotification(order);
  //     this.SaveInfluencerNotification(order);
  //     this.toast.ShowToast("Order Generated Successfully",'s');
  //   }
  // })

}
}

SaveBizmanNotification(Obj:any){
  if(Obj !=undefined){
    let n:notifications={
      $key:"",
      Title:"Proposal Accepted",
      Message:"Order assigned to ",
      InfluencerID:Obj.InfluencerID,
      InfluencerName:Obj.InfluencerName,
      PostID:Obj.PostID,
      ProposalID:Obj.ProposalID,
      OrderID:this.OrderID,
      BizmanID:Obj.BizmanID,
      BizmanName:Obj.BizmanName,
      Status:"P",
      Type:"orderCreated",
      isSeen:false,
      UserType:'1',
      isDismiss:false,
      isActive:true,
      CreatedDateTime:this.helper.formateDatePK(),
      ModifiedOn:"",
      SeenDateTime:"",
      WalletID:""

    }
    this.api.SaveNotification(n).then((data)=>{
      if(data){
        console.log("order notification ut1 saved")
     
      }
    })
  }
}
SaveInfluencerNotification(Obj){
  if(Obj !=undefined){
    let n:notifications={
      $key:"",
      Title:"Proposal Accepted",
      Message:"You have an new order",
      InfluencerID:Obj.InfluencerID,
      InfluencerName:Obj.InfluencerName,
      PostID:Obj.PostID,
      ProposalID:Obj.ProposalID,
      OrderID:this.OrderID,
      BizmanID:Obj.BizmanID,
      BizmanName:Obj.BizmanName,
      Status:"P",
      Type:"orderCreated",
      isSeen:false,
      UserType:'2',
      isDismiss:false,
      isActive:true,
      CreatedDateTime:this.helper.formateDatePK(),
      ModifiedOn:"",
      SeenDateTime:"",
      WalletID:""

    }
    this.api.SaveNotification(n).then((data)=>{
      if(data){
        console.log("order notification ut2 saved")
      }
    })
  }
}

async OpenAddCardModal(bizmanID) {

    const modal = await this.modal.create({
      component: AddCardComponent
    });
    modal.onDidDismiss().then((data) => {
    console.log(data);
    });
    return await modal.present();
}

ProposalRejectedNotification(index){
  let Obj=this.ProposalList[index];
  if(Obj !=undefined){
    let n:notifications={
      $key:"",
      Title:"Proposal Rejected",
      Message:"Businessman Rejected your proposal",
      InfluencerID:Obj.Porposal_Sent_By.key,
      InfluencerName:Obj.Porposal_Sent_By.FirstName,
      PostID:Obj.Porposal_on_Post.key,
      ProposalID:Obj.key,
      OrderID:"",
      BizmanID:Obj.Post_Created_By.key,
      BizmanName:Obj.Post_Created_By.FirstName,
      Status:"P",
      Type:"proposalRejected",
      isSeen:false,
      UserType:'2',
      isDismiss:false,
      isActive:true,
      CreatedDateTime:this.helper.formateDatePK(),
      ModifiedOn:"",
      SeenDateTime:"",
      WalletID:""
    }
    this.api.SaveNotification(n).then((data)=>{
      if(data){
        console.log("order notification ut2 saved")
      }
    })
  }
}

async ConfirmReject(key,i) {
  let alert =await this.alert.create({
    header:"Confirm",
    message: 'Do you want to reject proposal?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Reject',
        handler: () => {
          this.api.UpdateProposal(key,"R");
          this.ProposalRejectedNotification(i);
      }
      }
    ]
  });
  alert.present();
}

}
