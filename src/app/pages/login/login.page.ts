import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHelperService } from 'src/app/services/api-helper.service';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import Swal from 'sweetalert2';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LoadingController, MenuController, NavController } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ApiService } from 'src/app/services/api.service';
import { NavService } from 'src/app/services/Navigation/nav.service';







@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  UserID;
  Verification = [];
  LoginData = {
    UserData: {
      Email: "",
      Password: ""
    }
  }


  constructor(
    public route: Router,
    public Apihelper: ApiHelperService,
    public helper: HelperService,
    public local: LocalStorageService,
    public loading: LoadingController,
    public navCtrl: NavController,
    public sendEmail: EmailComposer,
    public toast: ToastService,
    public api: ApiService,
    private menu: MenuController,
    private nav: NavService
  ) { }




  ngOnInit() {

  }

  async Login() {



    let i = this.LoginData.UserData;
    i.Email.toLowerCase();
   
    
    if (this.LoginValidation()) {
      let loading = await this.loading.create({ message: "Signing..." });
      loading.present();
      this.api.Login(this.LoginData.UserData).then(u => {
        loading.dismiss();
        let usr: any = u;
        if (usr == false) {
          this.api.LoginActivity({Email:i.Email,Password:i.Password},"No");
          // this.helper.ShowAlert("username or password invalid", "top-end", "error"); 
          this.toast.ShowToast("Invalid username or password", "e");
          loading.dismiss();
        }
        else {
          let key: any = Object.keys(usr)[0];
          let user = usr[key];
          this.helper.userData = user;
          this.helper.userData.$key=key;

            this.local.set("userData", this.helper.userData);
            this.local.set("AuthKey", key);
          // this.helper.ShowAlert("Login Successfully", "top-end", "success");
          if(user.IsActive==="0"){
            this.toast.ShowToast("Admin Blocked Your Account to login. Please contact to admin.", "e");
          }
          
          else{
          if (user.UserType == "1" && user.isVerified == "0") {
            i.Email = "";
            i.Password = "";
            //this.navCtrl.navigateForward('/bizdash');

            this.SendVerificationEmail(user.Email, user.Token, user.FirstName).then((data) => {
              if (data == true) {
       
                // this.nav.goto_verifyemail({ Token: user.Token, ID: key });
                this.navCtrl.navigateForward('/verifyEmail');
                // this.helper.ShowAlert("Account verification code sent to your email .", "top-end", "warning");
                loading.dismiss();
              }
            }, (error) => {
              console.log("BussinessmAn Email Verification Code Error :" + error);
              loading.dismiss();
            });

          }
          else if (user.UserType == "1" && user.isVerified == "1") {
          this.api.LoginActivity({Email:i.Email,Password:i.Password},"Yes");
            this.helper.GetDaysofRegistration(user.CreatedOn)
            this.toast.ShowToast("Login Successfully", "s");
            this.navCtrl.navigateForward('/tabs/bizdash');

            loading.dismiss();
       
          }
          else if (user.UserType == "2" && user.isVerified == "0") {

            this.SendVerificationEmail(user.Email, user.Token, user.FirstName).then((data) => {
              if (data == true) {
    
                this.navCtrl.navigateForward('/verifyEmail');
                loading.dismiss();
              }
            }, (error) => {
              console.log("Inflauncer Email Verification Code Error : " + error)
            });

          }
          else if (user.UserType == 2 && user.isVerified == "1"){
          this.api.LoginActivity({Email:i.Email,Password:i.Password},"Yes");
            this.helper.GetDaysofRegistration(user.CreatedOn);
              this.GetRanking(key).then(()=>{
                this.toast.ShowToast("Login Successfully", "s");
                this.navCtrl.navigateForward('/tabs/inflancerdash');
              })
          loading.dismiss();
        }
        else if (user.UserType == 3 && user.isVerified == "1"){
       
                this.toast.ShowToast("Login Successfully", "s");
                this.navCtrl.navigateForward('/tabs/admindash');
            
          loading.dismiss();
        }
      }
    }


      }, (err) => {
        console.log(err);
        loading.dismiss();
      }).catch(errro => { console.log(errro); loading.dismiss() })
    }
  }


  SendVerificationEmail(To, Token, Name): Promise<Boolean> {
    return new Promise((resolve, err) => {
      this.Apihelper.get("https://bizbay.000webhostapp.com/sendEmail.php?To=" + To + "&Token=" + Token + "&Name=" + Name).then((data) => {

        let d = data;
        if (d.status == 1) {
          this.helper.ShowAlert("Email Verification Code Sent To Your Email", "top-end", "success");
          return resolve(true);
        }
        else if (d.status == 0 && d.errerID == 1) {
          this.helper.ShowAlert("Verification Code sent Faild", "top-end", "error");
          return resolve(false);
        }
      }, (error) => {
        return err(error);
      })
    })

  }



  goto_signup() {
    this.route.navigate(['signup']);
  }

  goto_forgotpassword() {
    this.route.navigate(['forgot-password']);
  }

  GetRanking(key):Promise<any>{
    return new Promise((resolve, err) => {
    this.api.GetRanking(key).then((usr:any)=>{
      if(usr !=false){
      let key: any = Object.keys(usr)[0];
      let rank = usr[key];
      this.helper.Rating=rank.Rating==""?"0.0":rank.Rating;
      return resolve(this.helper.Rating);
      }
      else{
        return resolve(this.helper.Rating="0.0");
        
      }
    })
  })
  }

  LoginValidation(){
    if(this.LoginData.UserData.Email=="" || this.LoginData.UserData.Email==undefined || this.LoginData.UserData.Email.toString().trim()=="" ){
      this.toast.ShowToast("Please enter email!","e");
     return false;
    }
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.LoginData.UserData.Email)==false) { 
      this.toast.ShowToast("Please enter valid email!","e");
     return false;
    }

    if(this.LoginData.UserData.Password=="" || this.LoginData.UserData.Password==undefined || this.LoginData.UserData.Password.toString().trim()=="" ){
      this.toast.ShowToast("Please enter Password!","e");
     return false;
    }

    else{
      return true;
    }

  }




}
