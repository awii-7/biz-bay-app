import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { notifications } from 'src/app/models/notifications';
import { Porposal } from 'src/app/models/proposal';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-send-porposal',
  templateUrl: './send-porposal.component.html',
  styleUrls: ['./send-porposal.component.scss'],
})
export class SendPorposalComponent implements OnInit {
  porposalForm: FormGroup;
  proposalID="";
  isSubmitted = false;
  Tags;

  PostImagePath:string;

  ProposalData;
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
      // this.helper.PageName="Create Post";
    this.helper.getPerposalData('all').then((data)=>{
      this.ProposalData=  data
    });
    // console.log(this.Data);
    }

  ngOnInit() {
        this.porposalForm = this.fb.group({
          Description:['',[Validators.required,Validators.minLength(8),Validators.maxLength(80),Validators.nullValidator]],
          Price:['',[Validators.required,Validators.minLength(2),Validators.maxLength(9),Validators.nullValidator]],
          DeleverInDays:['',[Validators.required,Validators.nullValidator]],
          
    })
  }

  

  async formSubmit(form){    
   this.isSubmitted=true;
    if (!this.porposalForm.valid) {
      return false;
    } else {
      let Value=this.porposalForm.value;
      let obj={
        $key:"",
        Description:Value.Description,
        Price:Value.Price,
        Order_Delever_DateTime:"".toString(),
        Order_Delever_Days:Value.DeleverInDays.split(" ")[0],
        Porposal_on_Post:this.ProposalData.Porposal_on_Post,
        Porposal_Sent_By:this.ProposalData.Porposal_Sent_By,
        Post_Created_By:this.ProposalData.Post_Created_By,
        Status:"P",
        isActive:true,
        CreatedDateTime:this.helper.formateDatePK(),
        ModifiedOn:""
      }
     console.log(obj)
     this.api.createProposal(obj).then((data:any)=>{
       if(data){
        //  alert(data);
         this.proposalID=data;
         console.log(data);
         this.toast.ShowToast("Proposal sent to Bussinessman. wait for accept",'s');
         this.SaveNotification(obj);
         this.porposalForm.reset();
         this.modal.dismiss();
         
       }
       else
       {
        console.log(data);
        this.toast.ShowToast("Proposal not sent to Bussinessman.",'e');
       }
     })
  }
  
  }

  Dismiss(){
    this.modal.dismiss()
  }

  SaveNotification(Obj){
    if(Obj !=undefined){
      let n:notifications={
        $key:"",
        Title:"Proposal Recived",
        Message:"",
        InfluencerID:Obj.Porposal_Sent_By.key,
        InfluencerName:Obj.Porposal_Sent_By.FirstName,
        PostID:Obj.Porposal_on_Post.key,
        ProposalID:this.proposalID,
        OrderID:"",
        BizmanID:Obj.Post_Created_By.key,
        BizmanName:Obj.Post_Created_By.FirstName,
        Status:"P",
        Type:"proposal",
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
          console.log("proposal notification saved")
        }
      })
    }
  }







}
