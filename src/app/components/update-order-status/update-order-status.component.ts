import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { notifications } from 'src/app/models/notifications';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-update-order-status',
  templateUrl: './update-order-status.component.html',
  styleUrls: ['./update-order-status.component.scss'],
})
export class UpdateOrderStatusComponent implements OnInit {
  orderForm: FormGroup;
  
  isSubmitted = false;
  Tags;
OrderDetail;
  PostImagePath:string;
  constructor(
    public fb:FormBuilder,
    public actionCtrl:ActionSheetController,
    public api:ApiService,
    public loading:LoadingController,
    public nav:NavService,
    public helper:HelperService,
    public toast:ToastService,
    public modal:ModalController
  ) {
this.OrderDetail= this.helper.getOrderData();
   }

  ngOnInit() {
    this.orderForm = this.fb.group({
      description:['',[Validators.required,Validators.minLength(8),Validators.maxLength(200),Validators.nullValidator]],
      ProgressPercentage:['',[Validators.required,Validators.nullValidator]],
      
})
this.StartPercentageArray();
  }

  Dismiss(){
    this.modal.dismiss()
  }


  OrderPercentage=[]
  async StartPercentageArray(){
   let tempArr=[]
   let percent=Number(this.OrderDetail.ProgressPercentage)+1;
   if(this.OrderDetail !=undefined){
     for (let i = percent; i <=100; i++) {
      tempArr.push(i);
     }
     return this.OrderPercentage=tempArr;
   }
  }
  TempCommentArr=[]; 
  async formSubmit(form){  
     
    this.isSubmitted=true;
     if (!this.orderForm.valid) {
       return false;
     } else {
       
      let perc=form.ProgressPercentage.substring(0, form.ProgressPercentage.length - 2)
      this.TempCommentArr= this.OrderDetail.Comments;
      this.TempCommentArr.push({
        message:form.description,
        datetime:this.helper.formateDatePK(),
        completed:perc
      })
      let obj={
        Comments:this.TempCommentArr,
        ModifiedOn:this.helper.formateDatePK(),
        ProgressPercentage:perc
      }
      this.api.updateOrderStatus(this.OrderDetail.key,obj).then((data)=>{
        if(data){
        this.toast.ShowToast("Order status updated",'s');
        this.orderForm.reset();
        this.SaveNotification();
        this.modal.dismiss();
        }
        else
        {
        this.toast.ShowToast("Order status updated failed",'e');
        }
      })
     

   }
   

   }

   SaveNotification(){
     let value=this.TempCommentArr[this.TempCommentArr.length-1];
    let n:notifications={
      $key:"",
      Title:"Order Updates",
      Message:value.message + " | "+value.completed+"%"+" Completed",
      InfluencerID:this.OrderDetail.InfluencerID,
      InfluencerName:this.OrderDetail.InfluencerName,
      PostID:"",
      ProposalID:"",
      OrderID:this.OrderDetail.key,
      BizmanID:this.OrderDetail.BizmanID,
      BizmanName:this.OrderDetail.BizmanName,
      Status:"P",
      Type:"orderUpdates",
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
        console.log("order notification ut2 saved")
      }
    })
  
}


}
