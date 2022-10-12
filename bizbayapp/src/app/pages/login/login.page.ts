import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHelperService } from 'src/app/services/api-helper.service';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import Swal from 'sweetalert2';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LoadingController, NavController } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';





@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  UType;
  SelectedUser: any;
  SelectedPlatform: any;
  si: any;
  placeholderText: any;
  Followers: 0;

  Bdata = {
    FirstName: "",
    LastName: "",
    UserType: 1,// 1-Buisnessman  2-Inflaucer 3- Admin
    UserName: "",
    Password: "",
    Email: "",
    SocialUserName: "",
    SocialType: 0, // 1 - Insta  2- Twitter -3 Facebook
    Address: "",
    City: "",
    Cellno: "",
    CompanyName: "",
    IsActive: 1,
    followercount: 0,
    isVerified: 0

  }

  Idata = {
    FirstName: "",
    LastName: "",
    UserType: 2,
    UserName: "",
    Email: "",
    Password: "",
    SocialUserName: "",
    SocialType: 0,
    Address: "",
    City: "",
    Cellno: "",
    CompanyName: "",
    IsActive: 1,
    followercount: this.Followers,
    isVerified: 0
  }
  LoginData = {
    UserData: {
      UserName: "",
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
    public sendEmail: EmailComposer
  ) { }

  WhoAreYou: any = {
    header: 'Who Are You?',
  };
  Platform: any = {
    header: 'Select Social Platform',
  };

  ngOnInit() {

  }

  Signup() {

  }


  SignUpForm() {
    const container = document.querySelector(".container");
    container.classList.add("sign-up-mode");
    this.LoginData.UserData.UserName = '';
    this.LoginData.UserData.Password = '';

  }

  SignInForm() {
    const container = document.querySelector(".container");
    container.classList.remove("sign-up-mode");
    this.ClearTextBox(this.UType);
    this.SelectedUser = -1;

  }






  UserType() {
    if (this.SelectedUser == "I'm Businessman") {
      this.SelectedPlatform = undefined;
      this.Idata.SocialType = undefined;
      this.Idata.SocialUserName = "";

      return this.UType = 1;


    }
    else {
      // var sn = document.getElementById("socialUsername");
      // if (sn != null || sn != undefined) {

      //   if (sn.hasAttribute("readonly")) {
      //     sn.removeAttribute("readonly")
      //   }

      


      // }
      return this.UType = 2;
    }
  }
  PlatformType() {
    this.si = '';
    this.placeholderText = '';
    if (this.SelectedPlatform == "Facebook") {
      this.placeholderText = "Facebook Page Username";
      this.Idata.SocialType = 3;
      return this.si = faFacebookSquare;

    }
    else if (this.SelectedPlatform == "Instagram") {

      this.placeholderText = "Instagram Username";
      this.Idata.SocialType = 1;

      return this.si = faInstagram;
    }
    else {
      this.placeholderText = "Twitter Username";
      this.Idata.SocialType = 2;
      return this.si = faTwitter;
    }
  }

  CheckBDataValidation(FName, LName, Email, Password, UserName) {
    if (this.SelectedUser == undefined || this.SelectedUser == '') {
      // alert("Please Choose UserType")
      return this.helper.ShowAlert("Please Choose UserType", "top-end", "warning");
      //this.route.navigate(['verifyEmail']);
    }
    if (FName == '' || LName == '' || Email == '' || Password == '' || UserName == '' && this.UType == 1) {
      // alert("Please Choose UserType")
      return this.helper.ShowAlert("Please Fill Required Fields!", "top-end", "warning");
      //this.route.navigate(['verifyEmail']);
    }

  }
  CheckIDataValidation() {
    if (this.SelectedUser == undefined || this.SelectedUser == '' && this.UType == 2) {
      // alert("Please Choose UserType")
      return this.helper.ShowAlert("Please Choose UserType", "top-end", "warning");
      //this.route.navigate(['verifyEmail']);
    }
    else if (this.SelectedPlatform == '' || this.SelectedPlatform == undefined && this.UType == 2) {
      // alert("Please Choose Platform");
      return this.helper.ShowAlert("Please Choose Platform", "top-end", "warning");

    }
    else if (this.Idata.SocialUserName == '' && this.UType == 2) {
      //alert("Please Enter Username");
      return this.helper.ShowAlert("Please Enter Username", "top-end", "warning");
    }
    else if (this.Followers == undefined && this.UType == 2) {
      //alert("Please Enter Username");
      return this.helper.ShowAlert("Please Verify Username First", "top-end", "warning");
    }
  }
  instaUsername;
  CheckDialogue() {
    let uname = document.getElementById("socialUsername");
    if (this.Followers > 1000) {
      if (uname.hasAttribute("readonly") != true && this.Followers > 1000) {
        uname.setAttribute("readonly", "true");
      }
    }
    else {
      Swal.fire({
        //title: 'Submit your instagram username',
        text: "Submit your instagram username",
        input: 'text',
        backdrop: false,

        showCloseButton: true,
        inputPlaceholder: "Enter Username",

        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Verify',
        showLoaderOnConfirm: true,
        preConfirm: (username) => {
          if (username != undefined) {
            //  if (uname.hasAttribute("readonly") != true && this.Followers > 1000) {
            //    uname.setAttribute("readonly", "true");
            // }
            this.Idata.SocialUserName = username;
            return this.CheckFollowers(username)
              .then(response => {
                if (!response.ok) {
                  throw new Error(response.statusText)
                }
                return response.json()
              })
              .catch(error => {
                Swal.showValidationMessage(
                  `Request failed: ${error}`
                )
              })
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      })
    }
  }

  CheckAvailability(username): Promise<Boolean> {
    return new Promise((resolve, error) => {

      if (username != undefined && username != "") {
        let v;
        this.Apihelper.Get("https://www.instagram.com/web/search/topsearch/?query=" + username).then((data) => {
          let d = data.users.length > 0;

          return resolve(d)
        })
      }

    })
  }

  CheckFollowers(username): any {

    this.CheckAvailability(username).then((data: boolean) => {

      if (data) {
        this.Apihelper.Get("https://www.instagram.com/" + username + "/?__a=1").then((data: any) => {
          let d = data;
          if (d != undefined) {
            console.log(d);
            this.Followers = d.graphql.user.edge_followed_by.count;

            if (this.Followers < 1000) {
              this.helper.ShowAlert("Sorry you are not eligible to join our community because your followers is " + this.Followers, "top-end", "error");
              this.SignInForm();
            }
            else {
              this.helper.ShowAlert("Hurray Your Folowers : " + this.Followers + ".Now you are eligible to join our community :)", "top-end", "success");

              return this.Followers;
            }
          }
        }, (errr) => {
          if (errr.status == 404) {
            this.helper.ShowAlert("Username not found or may be changed.Please choose correct username!", "top-end", "warning");
          }
        })

      }
      else {
        this.helper.ShowAlert("Username Not Found", "top-end", "warning");
      }





    })

  }


  Verification = [];
  async SignUp() {

    if (this.UType == undefined) { this.CheckIDataValidation() } else {
      let FName = this.Bdata.FirstName;
      let LName = this.Bdata.LastName;
      let UType = this.Bdata.UserType;
      let UName = this.Bdata.UserName;
      let Email = this.Bdata.Email;
      let Password = this.Bdata.Password;
      let SUName = this.Bdata.SocialUserName = "";
      let SType = this.Bdata.SocialType = 0;
      let Address = this.Bdata.Address;
      let City = this.Bdata.City;
      let Cellno = this.Bdata.Cellno;
      let CompanyName = this.Bdata.CompanyName;
      let IsActive = this.Bdata.IsActive;
      let followercount = this.Bdata.followercount;
      let isVerified = this.Bdata.isVerified;

      if (this.UType == 1) {
        if (this.CheckBDataValidation(FName, LName, Email, Password, UName)) {
        }
        else {
          let loading = await this.loading.create({
            message: "Please Wait.."
          });
          loading.present();
          this.Apihelper.Get(this.helper.baseUrl + "Signup.php?FirstName=" + FName + "&LastName=" + LName + "&UserType=" + UType + "&UserName=" + UName + "&Email=" + Email + "&Password=" + Password + "&SocialUserName=" + SUName + "&SocialType=" + SType + "&Address=" + Address + "&City=" + City + "&Cellno=" + Cellno + "&CompanyName=" + CompanyName + "&IsActive=" + IsActive + "&followercount=" + followercount + "&isVerified=" + isVerified).then((data: any) => {
            loading.dismiss();
            let d = data;
            if (d.status == 1) {
              if (d.data.isVerified == 0 && d.data.UserType == 1) {
                let Email = d.data.Email;
                let Name = d.data.FirstName + " " + d.data.LastName;
                let UserID = d.data.PK_ID;
                let Token = d.data.Token;
                let UserType = d.data.UserType;
                this.Verification.push({ Name, Email, UserID, Token, UserType })
                this.SendVerificationEmail(Email, Token);
                this.local.set("Verification", this.Verification);
                //this.helper.ShowAlert("Account Verification Code Sent to Your Email","top-end","success");
                this.navCtrl.navigateForward('/verifyEmail');

              }

              this.ClearTextBox(this.UType);
            }
            else if (d.status == 0 && d.errorID == 2) {
              this.helper.ShowAlert(d.error, "top-end", "warning");
              loading.dismiss();
            }
            else {
              this.helper.ShowAlert("Buissness Account Registered Failed.", "top-end", "error");
              loading.dismiss();
            }

          }, (err) => {
            console.log(err);
            loading.dismiss();
          })


        }
      }
      else if (this.CheckIDataValidation()) {

      }
      else {
        if (this.UType == 2 || this.Followers != undefined) {
          let FName = this.Idata.FirstName;
          let LName = this.Idata.LastName;
          let UType = this.Idata.UserType;
          let UName = this.Idata.UserName;
          let Email = this.Idata.Email;
          let Password = this.Idata.Password;
          let SUName = this.Idata.SocialUserName;
          let SType = this.Idata.SocialType;
          let Address = this.Idata.Address;
          let City = this.Idata.City;
          let Cellno = this.Idata.Cellno;
          let CompanyName = this.Idata.CompanyName;
          let IsActive = 1;
          let followercount = this.Followers;
          let isVerified = this.Idata.isVerified;

          let loading = await this.loading.create({
            message: "Please Wait.."
          });
          loading.present();
          this.Apihelper.Get(this.helper.baseUrl + "Signup.php?FirstName=" + FName + "&LastName=" + LName + "&UserType=" + UType + "&UserName=" + UName + "&Email=" + Email + "&Password=" + Password + "&SocialUserName=" + SUName + "&SocialType=" + SType + "&Address=" + Address + "&City=" + City + "&Cellno=" + Cellno + "&CompanyName=" + CompanyName + "&IsActive=" + IsActive + "&followercount=" + followercount + "&isVerified=" + isVerified).then((data: any) => {
            loading.dismiss();
            let d = data;
            if (d.status == 1) {

              if (d.data.isVerified == 0 && d.data.UserType == 2) {
                let Email = d.data.Email;
                let Name = d.data.FirstName + " " + d.data.LastName;
                let UserID = d.data.PK_ID;
                let Token = d.data.Token;
                let UfserType = d.data.UserType;
                this.Verification.push({ Name, Email, UserID, Token, UserType })
                this.SendVerificationEmail(Email, Token);
                this.local.set("Verification", this.Verification);
                //this.helper.ShowAlert("Account Verification Code Sent to Your Email","top-end","success");
                this.navCtrl.navigateForward('/verifyEmail');
                //this.navCtrl.navigateForward('/inflancerdash');
                //this.SignInForm();
                this.ClearTextBox(this.UType);

              }
            }
            else {
              this.helper.ShowAlert("Inflauncer Account Registered Failed.", "top-end", "error");
              loading.dismiss();
            }
          }, (err) => {
            console.log(err);
            loading.dismiss();
          })


        }
        else {
          this.helper.ShowAlert("Please first check followers counts!", "top-end", "warning");
        }
      }


    }
  }

  async Login() {

    if (this.LoginData.UserData.UserName == "" || this.LoginData.UserData.Password == "") {
      this.helper.ShowAlert("Please enter email or password", "top-end", "warning");
    }
    else {
      let Username = this.LoginData.UserData.UserName;
      let Password = this.LoginData.UserData.Password;
      let loading = await this.loading.create({
        message: "Please Wait.."
      });
      loading.present();
      this.Apihelper.Get(this.helper.baseUrl + "/Login.php?UserName=" + Username + "&" + "Password=" + Password).then((data: any) => {
        loading.dismiss();
        let d = data;
        if (d.status == 1) {
          console.log(d)
          this.helper.ShowAlert("Login Successfully", "top-end", "success");
          let userData = [];
          this.LoginData.UserData.UserName = "";
          this.LoginData.UserData.Password = "";
          let UserID = d.data.PK_ID;
          let Name = d.data.FirstName + " " + d.data.LastName;
          let UserName = d.data.UserName;
          let userEmail = d.data.Email;
          let Token = d.data.Token;
          let UserType = d.data.UserType;
          let isVerified = d.data.isVerified;
          this.Verification.push({ UserID, Name, UserName, userEmail, Token, UserType, isVerified });
          this.local.set("Verification", this.Verification);
          if (UserType == 1 && isVerified == 0) {
            //this.navCtrl.navigateForward('/bizdash');
            this.navCtrl.navigateForward('/verifyEmail');
            this.SendVerificationEmail(userEmail, Token);
            this.helper.ShowAlert("Account verification code sent to your email .", "top-end", "warning");
          }
          else if (UserType == 1 && isVerified == 1) {
            this.navCtrl.navigateForward('/bizdash');
          }
          else if (UserType == 2 && isVerified == 0) {
            this.navCtrl.navigateForward('/verifyEmail');
            this.SendVerificationEmail(userEmail, Token);
            this.helper.ShowAlert("Account verification code sent to your email .", "top-end", "warning");
          }
          else if (UserType == 2 && isVerified == 1)
            this.navCtrl.navigateForward('/inflancerdash');
        }
        else {
          this.helper.ShowAlert("Invalid Username or Password", "top-end", "error");
          loading.dismiss();

        }
      }, (err) => {
        console.log(err);
        loading.dismiss();
      })
    }

  }

  ClearTextBox(UserType) {

    if (UserType == 1) {

      this.Bdata.FirstName = ""
      this.SelectedUser = undefined;
      this.Bdata.LastName = "";
      this.Bdata.UserType = 1;
      this.Bdata.UserName = "";
      this.Bdata.Email = "";
      this.Bdata.Password = "";
      this.Bdata.SocialUserName = "";
      this.Bdata.SocialType = -1;


    }
    if (UserType == 2) {

      this.Idata.FirstName = ""
      this.SelectedUser = -1;
      this.Idata.LastName = "";
      this.Idata.UserType = 1;
      this.Idata.UserName = "";
      this.Idata.Email = "";
      this.Idata.Password = "";
      this.Idata.SocialUserName = "";
      this.Idata.SocialType = undefined;
      this.SelectedPlatform = undefined;
    }
  }

  SendVerificationEmail(To, Token) {
    this.Apihelper.Get("https://bizbaybrand.000webhostapp.com/SendEmail.php?To=" + To + "&Token=" + Token).then((data) => {
      let d = data;
      if (d.status == 1) {
        this.helper.ShowAlert("Email Verification Code Sent To Your Email", "top-end", "success");

      }
      else if (d.status == 0 && d.errerID == 1) {
        this.helper.ShowAlert("Verification Code sent Faild", "top-end", "error");
      }
    })
  }


}
