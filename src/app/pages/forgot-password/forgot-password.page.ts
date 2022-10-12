import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';
import { AlertController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { LoadingService } from 'src/app/services/Loading/loading.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  Email = "";
  step = 1;
  Code = {
    code1: "",
    code2: "",
    code3: "",
    code4: "",
    code5: "",
    code6: ""
  };
  UserVerificationData = {
    To: "",
    Token: "",
    Name: "",
    key: ""
  };
  Pressed = false;

  Password: "";
  ConfirmPassword: "";
  constructor(
    public route: Router,
    private toast: ToastService,
    private api: ApiService,
    private loading: LoadingService,
    private deviceinfo: Device,
    private helper: HelperService,
    private alert: AlertService,
    private local: LocalStorageService,
    private nav: NavService,
    private alertCtrl:AlertController


  ) { }


  ngOnInit() {
  }

  goto_login() {
    this.route.navigate(['login']);
  }

  CheckEmailExist() {
    if (this.Email == undefined || this.Email.toString().trim() == "" || this.Email == null) {
      this.toast.ShowToast("Please enter email address", 'e');
    }
    else {
      this.loading.Show('Please wait...');
      this.api.ForgotPassword(this.Email).then((data: any) => {
        if (data) {
          this.UserVerificationData = {
            Name: data.Name,
            To: data.Email,
            Token: data.Token,
            key: data.key
          };

          this.helper.SendResetPasswordCode(data.Email, data.Token, data.Name).then((data) => {
            if (data) {
              this.local.set("ResetData", this.UserVerificationData);
              this.loading.Hide();
              this.toast.ShowToast("Please check your email. Reset code sent to your email.", "s");
              this.step = 2;

            }
            else if (data == false) {
              this.loading.Hide();
              this.toast.ShowToast("Reset code not sent.", "e");
              // this.step=2;
            }
          }, (error) => {
            this.loading.Hide();
          })
        }
        else if (data == false) {
          this.loading.Hide();
          this.toast.ShowToast("Account not found on this email", 'e');
        }
      }, ((error) => {
        this.loading.Hide();
      }))

    }
  }

  VerifyCode() {
    let TokenCode = this.Code.code1 + this.Code.code2 + this.Code.code3 + this.Code.code4 + this.Code.code5 + this.Code.code6;
    if (TokenCode.length != 6) {
      this.toast.ShowToast("Please fill verification code", 'e');
    }
    else {

      if (this.UserVerificationData.Token == TokenCode) {
        // this.loading.ShowLoading("Checking....");
        this.loading.ShowLoading("Checking....").then((data) => {
          if (data == true) {
            this.toast.ShowToast("Verification code matched", 's');
            this.step = 3;
          }
        });

      }
      else {
        this.loading.ShowLoading("Checking....").then((data) => {
          if (data == true) {

            this.toast.ShowToast("Invalid verification code", 'e');

          }
        })

      }

    }
  }


  VerificationCode(event) {
    let id = event.target.id;
    let value = event.target.value;
    if (id != undefined) {
      if (value != "") {
        let OnlyID = id.split("_")[1];
        let ID = Number(OnlyID) + 1;
        let ShiftInput = "code_" + ID;
        let input = document.getElementById(ShiftInput);
        if (input != undefined) { input.focus() }
        console.log(this.Code);


      }
      else {
        if (event.keyCode == 8) {
          let OnlyID = id.split("_")[1];
          let ID = Number(OnlyID) - 1;
          let ShiftInput = "code_" + ID;

          let input = document.getElementById(ShiftInput);
          if (input != undefined) { input.focus() }
          console.log(this.Code);

        }
      }
    }
  }

  ResendVerificationCode() {
    if (this.Pressed) {

      this.helper.SendResetPasswordCode(this.UserVerificationData.To, this.UserVerificationData.Token, this.UserVerificationData.Name).then((data) => {
        if (data) {
          this.loading.Hide();
          this.toast.ShowToast("Please check your email. Reset code sent to your email.", "s");
          this.step = 2;
          this.Pressed = true;
        }
        else if (data == false) {
          this.loading.Hide();
          this.toast.ShowToast("Reset code not sent.", "e");
          // this.step=2;
        }
      }, (error) => {
        this.loading.Hide();
      })

    }
  }

  async ConfirmChange() {
    let alert = await this.alertCtrl.create({
      header:"Confirm?",
      message: 'Do you want to change password',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Change',
          handler: () => {
            this.ResetPassword();
          }
        }
      ]
    });
    alert.present();
  }


  ResetPassword() {
    if (this.ValidationPassword()) {
      this.loading.Show('Reseting password...');
      this.local.get("ResetData").then((data1) => {
        if (data1 != undefined || data1 != null) {
          this.api.getUserByIds(data1.key).then(u => {
            let user = {
              FirstName: u.FirstName,
              LastName: u.LastName,
              SocialType: u.SocialType,// 1-Buisnessman  2-Inflaucer 3- Admin
              UserName: u.UserName,
              Password: this.Password,
              Email: u.Email,
              SocialUserName: u.SocialUserName,
              UserType: u.UserType, // 1 - Insta  2- Twitter -3 Facebook
              Address: u.Address,
              City: u.City,
              Cellno: u.Cellno,
              CompanyName: u.CompanyName,
              IsActive: u.IsActive,
              followercount: u.followercount,
              isVerified: u.isVerified,
              ProfilePic: u.ProfilePic,
              Token: u.Token,
              CreatedOn: u.CreatedOn,
              ModifiedOn: new Date().toLocaleDateString(),
              fcmToken:u.fcmToken
            }
            this.api.UpdatePassword(data1.key, user).then((data: any) => {
              if (data == true) {
                this.Password = "";
                this.ConfirmPassword = ""
                this.loading.Hide();
                this.helper.PasswordChangedSuccessMsg(data1.To, data1.Name);
                 this.toast.ShowToast("Password reset successfully.", "s");
                 this.nav.goto_login();
              }
              else if (data == false) {
                this.loading.Hide();
                this.toast.ShowToast("Password reset failed.", "e");
              }
            }, (error) => {
              console.log(error);
              this.loading.Hide();
            })

          }, (error) => {
            console.log(error);
            this.loading.Hide();
          })
        }
      }, (error) => {
        console.log(error);
        this.loading.Hide();
      })

    }

  }


  ValidationPassword() {
    if (this.Password == undefined || this.Password == null || this.Password.toString().trim() == "") {
      this.toast.ShowToast("Please enter new password", "e");
      return false;
    }
    if (this.ConfirmPassword == undefined || this.ConfirmPassword == null || this.ConfirmPassword.toString().trim() == "") {
      this.toast.ShowToast("Please enter Confirm password", "e");
      return false;
    }
    if (this.ConfirmPassword != this.Password) {
      this.toast.ShowToast("Password does not matched", "e");
      return false;
    }
    else {
      return true;
    }
  }

  ConfirmResetPassword() {
    this.alert.Confirm(this.ResetPassword(), "Reset", "Do you want to reset password?");
  }



}
