import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { notifications } from 'src/app/models/notifications';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss'],
})
export class AddCardComponent implements OnInit {

  addCard={
    CardHolderName:"",
    CardNo:"",
    ExpiryMonth:"",
    ExpiryYear:"",
    BizmanID:"",
    CreatedOn:"",
    ModifiedOn:"",
    isActive:true,
    isExpire:false,
  }
  ProposalID:"";
  constructor(
    public nav:NavService,
    private api: ApiService,
    private router: Router,
    public fb: FormBuilder,
    public helper:HelperService,
    public route:ActivatedRoute,
    public toast:ToastService,
    public modal:ModalController
  ) {
    this.addCard.ExpiryMonth=(new Date().getMonth()+1).toString() ;
    this.addCard.ExpiryYear=new Date().getFullYear().toString();
   }

  ngOnInit() {}

  
  addCards(){
   let AccountBalance=this.helper.GenerateBalance()
    if(this.addCard.CardHolderName=="" || this.addCard.CardNo=="" || this.addCard.ExpiryMonth=="" || this.addCard.ExpiryYear==""){
      this.toast.ShowToast("Please Fill All Fields",'e');
    }
    else
    {
      let obj={
        CardHolderName:this.addCard.CardHolderName,
        CardNo:this.addCard.CardNo,
        ExpiryMonth:this.addCard.ExpiryMonth,
        ExpiryYear:this.addCard.ExpiryYear,
        BizmanID:this.helper.userData.$key,
        CreatedOn:this.helper.formateDatePK(),
        ModifiedOn:"",
        isActive:true,
        isExpire:false,
        AccountBalance:AccountBalance
      }

      this.api.AddCard(obj).then(()=>{
        this.SaveBizmanNotification()
        this.Dismiss();
      })
    }
  }

  SaveBizmanNotification(){
      let n:notifications={
        $key:"",
        Title:"VISA Card Added",
        Message:"Your Card "+this.addCard.CardNo.split(" ")[0]+"xxxx  connected.",
        InfluencerID:"",
        InfluencerName:"",
        PostID:"",
        ProposalID:"",
        OrderID:"",
        BizmanID:this.helper.userData.$key,
        BizmanName:this.helper.userData.FirstName.split(" ")[0],
        Status:"P",
        Type:"cardConnected",
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

  Dismiss(){
    this.modal.dismiss()
  }

}
