import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';
import { HelperService } from '../HelperService/helper.service';
import { NavController, MenuController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { EmailComposer } from '@ionic-native/email-composer';
import { ApiService } from '../api.service';
import { ToastService } from '../toast/toast.service';
import { LoadingService } from '../Loading/loading.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  Active="";
  constructor(
    public route:Router,
    public local:LocalStorageService,
    public helper:HelperService,
    public nav:NavController,
    private menuCtrl : MenuController,
    private api:ApiService,
    private toast:ToastService,
    private loading:LoadingService,
    private location:Location
  ) { }

  goto_profile(){
    
    this.route.navigate(['tabs/profile2'],{replaceUrl:true})
    this.menuCtrl.close();
  }
  goto_bizdash(){
    this.local.get("userData").then((user)=>{
      if(user.UserType==1){
      this.route.navigate(['tabs/bizdash'],{replaceUrl:true});
      this.menuCtrl.close();
      }
    })

  }

  goto_inflancerdash(){
    this.local.get("userData").then((user)=>{
      if(user.UserType==2){
        this.route.navigate(['tabs/inflancerdash'],{replaceUrl:true});
      this.menuCtrl.close();
      }
    })
   
  }

  goto_admin(){
    this.local.get("userData").then((user)=>{
      if(user.UserType==3){
        this.route.navigate(['tabs/admindash'],{replaceUrl:true});
      this.menuCtrl.close();
      }
    })
   
  }

  goto_chat(){
    this.route.navigate(['chat'],{replaceUrl:true});
    this.menuCtrl.close();
 
  }
  goto_login(){
    this.nav.navigateRoot('login');
    this.menuCtrl.close();
    this.local.clear();
  }

  goto_signup(){
    this.route.navigate(['signup'],{replaceUrl:true});
  } 
   goto_feedback(){
    this.route.navigate(['feedback'],{replaceUrl:true});
    this.menuCtrl.toggle();
  }

  goto_post(){
    this.route.navigate(['tabs/maintainpost'],{replaceUrl:true});
    this.menuCtrl.close();
    // this.helper.PageName="Create Post";
  }
  goto_postlist(){
    this.loading.ShowPostListLoading("Opening Post List ...").then(()=>{
      this.route.navigate(['tabs/postlist'],{replaceUrl:true});
      this.menuCtrl.close();
    });

  }

  goto_postdetail(postid){
    this.route.navigate(['tabs/postdetail', postid]);
  }
  goto_notification(){
    this.route.navigate(['tabs/notification']);
  }

  goto_mypost(){
    this.route.navigate(['tabs/myposts']);
  }

  goto_userdetail(userid){
    this.route.navigate(['userdetail', userid]);
  }

  goto_verifyemail(id){
    this.route.navigateByUrl('/verifyEmail',{replaceUrl:true,queryParams:id});
  }

  goto_back(){
    this.location.back();
  }

  logout() {
    this.local.clear().then(() => {
      this.route.navigate(['login']);
      this.menuCtrl.toggle();
      this.api.authState.next(false);
    });
   this.helper.userData={
      $key:"",
      FirstName:"",
      LastName: "",
      UserName: "",
      Password:"",
      Email: "",
      Address: "",
      City: "",
      Cellno: "",
      ProfilePic: "",
      ModifiedOn:"",
      SocialType:"",
      SocialUserName:"",
      UserType:"",
      CompanyName: "",
      IsActive: "1",
      followercount:"",
      isVerified:"",
      Token:"",
      CreatedOn:"",
      OrderCount:0,
      Rating:0.0,
      TotalStars:0,
      fcmToken:""
         
    }
    this.toast.ShowToast("Logout successfully",'s');
  }

  goto_myproposal(isInfluencer?){
    if(isInfluencer==true){
    this.route.navigate(['tabs/myproposal']);
    }
    else{
      this.route.navigate(['tabs/myproposal']);
    this.menuCtrl.toggle();
    }
  }

  goto_recivedproposals(){
    this.route.navigate(['tabs/recived-proposals']);
    this.menuCtrl.toggle();
  }
  goto_recivedproposal(key?:string,notificationid?){
    this.helper.activeProposal=key
    if(notificationid !=undefined){
    this.api.UpdateNotification(notificationid)
    }
    this.route.navigate(['tabs/recived-proposals']);

  }
  goto_ordersList(){
    this.route.navigate(['tabs/orders']);
    this.menuCtrl.toggle();
  }

  goto_ordersLists(){
    this.route.navigate(['tabs/orders']);

  }

  

  goto_trackorder(orderid){
    this.route.navigate(['tabs/trackorder', orderid]);
  }

  goto_influencerList(){
    this.route.navigate(['tabs/influencerlist']);
    // this.menuCtrl.toggle();
  }

  goto_conversation(){
    this.route.navigate(['tabs/messagelist'],{replaceUrl:true});
    // this.menuCtrl.close();
 
  }

  openChat(roomid){
    this.route.navigate(['chat', roomid]);
  }

  goto_users(){
    this.route.navigate(['tabs/userslist'],{replaceUrl:true});
  }

  goto_payorder(){
    this.route.navigate(['tabs/payorder'],{replaceUrl:true})
  }

  goto_revieworder(){
    this.nav.navigateRoot('revieworder',{replaceUrl:true})
  }

  goto_Influencer_payment(){
    this.route.navigate(['tabs/influencer_payments'],{replaceUrl:true});
  }
 
  
  goto_post_list(){
    this.route.navigate(['tabs/posts-list'],{replaceUrl:true});
  }

  
  goto_proposal_list(){
    this.route.navigate(['tabs/proposals'],{replaceUrl:true});
  }
  goto_order_list(){
    this.route.navigate(['tabs/orders-lists'],{replaceUrl:true});
  }

  goto_wallet(v){
    if(v==1){
    this.route.navigate(['tabs/e-wallet'],{replaceUrl:true});
    }
    else
    {
    this.route.navigate(['tabs/e-wallet'],{replaceUrl:true});
    this.menuCtrl.close();
    }
  }

}
