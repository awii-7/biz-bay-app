import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Porposal } from 'src/app/models/proposal';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-proposals',
  templateUrl: './proposals.page.html',
  styleUrls: ['./proposals.page.scss'],
})
export class ProposalsPage implements OnInit {
ProposalList=[]
  constructor(
    public nav:NavService,
    public api:ApiService,
    public helper:HelperService,
    public actionCtrl:ActionSheetController,
    public toast:ToastService,
    public alertCtrl:AlertController
  ) { }

  ngOnInit() {
    let p = this.api.getProposalList();
    p.snapshotChanges().subscribe(res => {
      this.ProposalList = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['key'] = item.key;
     
        this.ProposalList.push(a as Porposal);
        
        })
      })
  }

  async presentActionSheet(id,obj,isblocked) {
    let btnText=isblocked==1?"UnHide Proposal":"Hide Proposal";
    let icon=isblocked==1?"eye-outline":"eye-off-outline";
    let actionSheet =await this.actionCtrl.create({

      buttons: [
        {
         
          text: 'View Proposal',
          icon:"search-outline",
          handler: () => {
            // this.PayConfirm(id)
            // this.imageCaptured();
            this.ShowDetail(obj)
          }
        },
        {
          text: btnText,
          icon:icon,
       
          handler: () => {
            // this.imageCapturedGallery();
            // this.presentAlert(id)
            isblocked==1?this.UnHideConfirm(id):this.HideConfirm(id);
          }
        },
        {
          text: 'Delete Proposal',
          icon:"trash-outline",
 
          handler: () => {
            // this.imageCapturedGallery();
            // this.presentAlert(id)
             this.DeleteConfirm(id)
          },
         
         
        },
      ]
    });
    actionSheet.present();
  
  }

  async DeleteConfirm(id) {
    let alert =await this.alertCtrl.create({
      header:"Confirm",
      message: 'Do you want to delete?',
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
          cssClass:"text-danger",
          handler: () => {
            this.DeleteProposals(id)
            console.log('user delete click');
          }
        }
        
      ]
    });
    alert.present();
  }

  async HideConfirm(id) {
    let alert =await this.alertCtrl.create({
      header:"Confirm",
      message: 'Do you want to Hide?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Hide',
          cssClass:"text-danger",
          handler: () => {
            this.HideProposal(id)
            console.log('user block click');
          }
        }
        
      ]
    });
    alert.present();
  }

  async UnHideConfirm(id) {
    let alert =await this.alertCtrl.create({
      header:"Confirm",
      message: 'Do you want to Unhide?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'UnHide',
          cssClass:"text-success",
          handler: () => {
            this.ShowProposal(id)
            console.log('user unblock click');
          }
        }
        
      ]
    });
    alert.present();
  }

  async ShowDetail(obj) {
    let br="<br>";
    let detail=
    "Desicription : "+obj.Description+br+br+
    "Send by : "+obj.Porposal_Sent_By.FirstName+br+br+
    "Send To : "+obj.Post_Created_By.FirstName+br+br+
    "Price : Rs"+obj.Price+br+br+
    "Created :"+"("+this.helper.RelativeTime(obj.CreatedDateTime)+")"

                
   
    let alert =await this.alertCtrl.create({
      header:"User Derail",
      message: detail,
      subHeader:"Created on "+obj.CreatedDateTime.split(" ")[0],
      buttons: [
        {
          text: 'Okey',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },        
      ]
    });
    alert.present();
  }



  HideProposal(id){
  this.api.ProposalStatusUpdate(id,0).then((data)=>{
    this.toast.ShowToast("Proposal Hided",'s');
    // this.SaveNotification(2,obj)

  })
}

ShowProposal(id){
  this.api.ProposalStatusUpdate(id,1).then((data)=>{
    this.toast.ShowToast("User UnHided",'s');

  })
}

DeleteProposals(id){
  this.api.deleteProposal(id);
  this.toast.ShowToast("Proposal  Deleted",'s');
  // this.SaveNotification(3,obj)

}

}
