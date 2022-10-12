import { Component, OnInit } from '@angular/core';
import { ApiHelperService } from 'src/app/services/api-helper.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NavController, LoadingController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UsersRegistration } from 'src/app/models/usersRegistration';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.page.html',
  styleUrls: ['./verify-account.page.scss'],
})
export class VerifyAccountPage implements OnInit {
  user: UsersRegistration;
  VerificationCode: string = "";
  UserID: any;
  Token: any;
  userEmail: any;
  constructor(
    //public api:ApiHelperService,
    public helper: HelperService,
    public local: LocalStorageService,
    public navCtrl: NavController,
    public login: LoginPage,
    public route: Router,
    public loading: LoadingController,
    public api: ApiService,
    public toast: ToastService,
    private ActiveRoute: ActivatedRoute,
    private apiHelper:ApiHelperService


  ) {
    

   
  }

  ngOnInit() {
  }

  VerifybyCode() {
    this.local.get("AuthKey").then((key)=>{
    this.api.getUserByIds(key).then(u => {

      if (u.Token == this.VerificationCode) {
        let user = {
          FirstName: u.FirstName,
          LastName: u.LastName,
          SocialType: u.SocialType,// 1-Buisnessman  2-Inflaucer 3- Admin
          UserName: u.UserName,
          Password: u.Password,
          Email: u.Email,
          SocialUserName: u.SocialUserName,
          UserType: u.UserType, // 1 - Insta  2- Twitter -3 Facebook
          Address: u.Address,
          City: u.City,
          Cellno: u.Cellno,
          CompanyName: u.CompanyName,
          IsActive: u.IsActive,
          followercount: u.followercount,
          isVerified: "1",
          ProfilePic: u.ProfilePic,
          Token: u.Token,
          CreatedOn: u.CreatedOn,
          ModifiedOn: this.helper.formateDatePK(),
          fcmToken:u.fcmToken
        }
        this.api.VerifyUser(this.UserID, user).then((data) => {
          if (data == true) {
            if (user.UserType == 1) {
              this.SendWelcomeEmail(user.Email,user.FirstName);
              this.route.navigate(['/tabs/bizdash']);
              this.api.authState.next(true)
              this.toast.ShowToast("Account Verified", "s");
            }
            else if (user.UserType == 2) {
              this.api.authState.next(true)
              this.SendWelcomeEmail(user.Email,user.FirstName);
              this.route.navigate(['/tabs/inflancerdash']);
              this.toast.ShowToast("Account Verified", "s");
            }
          }
          else {
            this.toast.ShowToast("Account Verification Failed", "e");
          }
        }).catch(error => console.log(error));
      }
      else {
        this.toast.ShowToast("Invalid Verification Code!", "e");
        // this.helper.ShowAlert("Invalid Verification Code!", "top-end", "error");
      }
    })
  });
  }

  // async VerifybyCode(){
  //   if(this.VerificationCode==undefined || this.VerificationCode.toString().trim() ==""){
  //     this.helper.ShowAlert("Please Enter Verification Code!","top-end","warning");
  //   }

  //   else{
  //     let loading = await this.loading.create({
  //       message: "Please Wait..",
  //       spinner:'bubbles',
  //       animated:true
  //     });

  //       this.local.get("userData").then((data)=>{
  //         if(data[0] !=undefined){
  //           this.UserID=data.UserID;
  //           this.Token=this.VerificationCode;
  //           let UserType=data.UserType;
  //           loading.present();

  //           this.api.Get(this.helper.baseUrl+"/Verified.php?UserID="+this.UserID+"&Token="+this.Token).then((data)=>{

  //             let d=data;
  //             if(d.status==1 && UserType==1){
  //               loading.dismiss();
  //               this.helper.ShowAlert("Congratulations ! Your Acount hase been Verified","top-end","success");
  //               this.navCtrl.navigateRoot('/bizdash');
  //             }
  //            else if(d.status==1 && UserType==2){
  //             loading.dismiss();
  //               this.helper.ShowAlert("Congratulations ! Your Acount hase been Verified","top-end","success");
  //               this.navCtrl.navigateRoot('/inflancerdash');
  //             }
  //             else if(d.status==0){
  //               loading.dismiss();
  //               this.helper.ShowAlert(d.message,"top-end","error");
  //             }
  //           })
  //         }
  //       })  


  //   }
  // }
  // cTime=120;
  // sendLater=false;
  //  myTimer(){
  //   if(this.cTime == 0){
  //     document.getElementById("resend").innerText = "Resend code";
  //     this.sendLater=false;
  //   } else{
  //     document.getElementById("resend").innerHTML = this.cTime.toString();
  //     this.sendLater=true;
  //     this.cTime = this.cTime - 1;
  //     setTimeout(this.myTimer, 1000);

  //   }
  // }



  ResendVerificationCode() {
    this.local.get("userData").then(async (data) => {
      if (data[0] != undefined) {
        this.Token = data.Token;
        this.userEmail = data.userEmail;
        let loading = await this.loading.create({
          message: "Please Wait.."
        });
        loading.present();
        this.login.SendVerificationEmail(this.userEmail, this.Token.toString(), data.Name).then((data) => {
          if (true) {
            loading.dismiss();
          }
        });
      }
      else {
        this.loading.dismiss();
      }


    })

  }

  goto_login() {
    this.route.navigate(['login']);
  }

  SendWelcomeEmail(To,Name) {
    this.api.GetTotalUserCount().then((data)=>{
      if(data !=false){
        let Toatal=data;
      this.apiHelper.get("https://bizbay.000webhostapp.com/SignupWelcomeEmail.php?To=" + To + "&Total=" + Toatal+"&Name="+Name).then((data) => {
        let d = data;
        if (d.status == 1) {
          // this.helper.ShowAlert("Email Verification Code Sent To Your Email", "top-end", "success");
          // this.toast.ShowToast("Email Verification Code Sent To Your Email","s");
  
        }
        else if (d.status == 0 && d.errerID == 1) {
          // this.helper.ShowAlert("Verification Code sent Faild", "top-end", "error");
          // this.toast.ShowToast("Verification Code sent Faild","e");
        }
      })
    }
    })

  }

}

