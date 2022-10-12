import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHelperService } from 'src/app/services/api-helper.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ActionSheetController, LoadingController, MenuController, NavController } from '@ionic/angular';
import { FormBuilder,FormGroup } from '@angular/forms';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { ApiService } from 'src/app/services/api.service';
import { AngularFireDatabase } from '@angular/fire/database/database';
import { CameraOptions,Camera } from "@ionic-native/camera/ngx";
import { ToastService } from 'src/app/services/toast/toast.service';

declare var $:any;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  SignupForm: FormGroup; 
  ImagePath:any="";
  UType;
  SelectedUser: any;
  SelectedPlatform:any='Instagram';
  Followers: "0";

 CreatedOn= new Date().toLocaleString()

  Bdata = {
    $key:"",
    FirstName: "",
    LastName: "",
    UserType: "1",// 1-Buisnessman  2-Inflaucer 3- Admin
    UserName: "",
    Password: "",
    Email: "",
    SocialUserName: "",
    SocialType: "", // 1 - Insta  2- Twitter -3 Facebook
    Address: "",
    City: "",
    Cellno: "",
    CompanyName: "",
    IsActive: "1",
    followercount: "0",
    isVerified: "0",
    ProfilePic:this.ImagePath,
    Token:this.helper.GenerateToken(),
    CreatedOn:this.CreatedOn,
    ModifiedOn:"",
    Rating:0.0,
    OrderCount:0,
    TotalStars:0,
    fcmToken:""

  }

  Idata = {
    $key:"",
    FirstName: "",
    LastName: "",
    UserType: "2",// 1-Buisnessman  2-Inflaucer 3- Admin
    UserName: "",
    Password: "",
    Email: "",
    SocialUserName: "",
    SocialType: "", // 1 - Insta  2- Twitter -3 Facebook
    Address: "",
    City: "",
    Cellno: "",
    CompanyName: "",
    IsActive: "1",
    followercount: "",
    isVerified: "0",
    ProfilePic:this.ImagePath,
    Token:this.helper.GenerateToken(),
    CreatedOn:this.CreatedOn,
    ModifiedOn:"",
    Rating:0.0,
    OrderCount:0,
    TotalStars:0,
    fcmToken:""
  }



  constructor(
    public route: Router,
    public Apihelper: ApiHelperService,
    public helper: HelperService,
    public local: LocalStorageService,
    public loading: LoadingController,
    public navCtrl: NavController,
    public sendEmail: EmailComposer,
    public fb: FormBuilder,
    public api:ApiService,
    public camera:Camera,
    public actCtrl:ActionSheetController,
    public menu:MenuController,
    public toast:ToastService
  ) { 
    this.SelectedUser="bizman";
    this.UType = 1;
    this.Bdata.SocialType=""
  }

  WhoAreYou: any = {
    header: 'Who Are You?',
  };
  Platform: any = {
    header: 'Select Social Platform',
  };

  ngOnInit() {
    this.SignupForm = this.fb.group({
      title: [''],
      type: [''],
    })
  }

  Signup() {

  }
  Shifted=false;
  segmentChanged(ev){
 if (this.SelectedUser == "bizman") {
      this.SelectedPlatform = "";
      this.Idata.SocialType = "";
      this.Bdata.SocialType = "";
      this.Idata.SocialUserName = "";
      this.Shifted=true;
      return this.UType = 1;

    }
    else {
      this.SelectedPlatform="Instagram"
      this.Idata.SocialType = "1";
      return this.UType = 2;
    }
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  SignInForm() {
    this.ClearTextBox(this.UType);
    this.SelectedUser = -1;
  }

 






  UserType() {
    if (this.SelectedUser == "I'm Businessman") {
      this.SelectedPlatform = "";
      this.Idata.SocialType = undefined;
      this.Idata.SocialUserName = "";

      return this.UType = 1;


    }
    else {
      this.SelectedPlatform="Instagram"
      return this.UType = 2;
      
    }
  }


  CheckBDataValidation() {
    var numbers = /^[0-9]+$/;
    if (this.SelectedUser == undefined || this.SelectedUser == '') {
      // alert("Please Choose UserType")
       this.toast.ShowToast("Please Choose your type",'e');
       return false;
      //this.route.navigate(['verifyEmail']);
    }
    if(this.Bdata.FirstName=="" || this.Bdata.FirstName==undefined || this.Bdata.FirstName==null || this.Bdata.FirstName.toString().trim()==""){
      this.toast.ShowToast("Please enter First Name",'e');
      return false;
    }
    if(this.Bdata.LastName=="" || this.Bdata.LastName==undefined || this.Bdata.LastName==null || this.Bdata.LastName.toString().trim()==""){
      this.toast.ShowToast("Please enter last name",'e');
      return false;
    }
    if(this.Bdata.UserName=="" || this.Bdata.UserName==undefined || this.Bdata.UserName==null || this.Bdata.UserName.toString().trim()==""){
      this.toast.ShowToast("Please enter username",'e');
      return false;
    }
    if (this.Bdata.UserName.match(numbers))
     {
      this.toast.ShowToast("Please enter valid username",'e');
      return false;
    }
    if(this.Bdata.Email=="" || this.Bdata.Email==undefined || this.Bdata.Email==null || this.Bdata.Email.toString().trim()==""){
      this.toast.ShowToast("Please enter email",'e');
      return false;
    }
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.Bdata.Email)==false  && this.UType == 1) {
      // alert("Please Choose UserType")
      // this.helper.ShowAlert("Please Enter Valid Email!", "top-end", "warning");
      this.toast.ShowToast("Please enter valid email",'e');

     return false;
      //this.route.navigate(['verifyEmail']);
    }

    if(this.Bdata.Password=="" || this.Bdata.Password==undefined || this.Bdata.Password==null || this.Bdata.Password.toString().trim()==""){
      this.toast.ShowToast("Please enter password",'e');
      return false;
    }
    if(this.helper.SignupProfilePic=="" || this.helper.SignupProfilePic==undefined || this.helper.SignupProfilePic==null || this.helper.SignupProfilePic.toString().trim()==""){
      this.toast.ShowToast("Please choose profile pic",'e');
      return false;
    }
    if(this.Privacy==false){
      this.toast.ShowToast("Accept our privacy policy & terms and conditions ",'e');
      return false;
    }

    else{
      return true;
    }


  }
  Privacy=false;
  CheckIDataValidation() {
    if(this.UType==2){
    if (this.SelectedUser == undefined || this.SelectedUser == '' && this.UType == 2) {
      // alert("Please Choose UserType")
      //  this.helper.ShowAlert("Please Choose UserType", "top-end", "warning");
      this.toast.ShowToast("Please Choose UserType",'e');

      return false;
      //this.route.navigate(['verifyEmail']);
    }

     if (this.Idata.SocialUserName == '' && this.UType == 2 ) {
      //alert("Please Enter Username");
      // this.helper.ShowAlert("Please Enter Username", "top-end", "warning");
      this.toast.ShowToast("Please Enter Username",'e');
      
      return false;
    }
    if (this.Followers == undefined && this.UType == 2) {
      //alert("Please Enter Username");
      //  this.helper.ShowAlert("Please Verify Username First", "top-end", "warning");
      this.toast.ShowToast("Please Verify Username First",'e');

       return false;
    }
    if(this.Idata.FirstName=="" || this.Idata.FirstName==undefined || this.Idata.FirstName==null || this.Idata.FirstName.toString().trim()==""){
      this.toast.ShowToast("Please enter First Name",'e');
      return false;
    }
    if(this.Idata.LastName=="" || this.Idata.LastName==undefined || this.Idata.LastName==null || this.Idata.LastName.toString().trim()==""){
      this.toast.ShowToast("Please enter last name",'e');
      return false;
    }
    if(this.Idata.UserName=="" || this.Idata.UserName==undefined || this.Idata.UserName==null || this.Idata.UserName.toString().trim()==""){
      this.toast.ShowToast("Please enter username",'e');
      return false;
    }
    if (this.Idata.UserName.match("[0-9]+"))
     {
      this.toast.ShowToast("Please enter valid username",'e');
      return false;
    }
    if(this.Idata.Email=="" || this.Idata.Email==undefined || this.Idata.Email==null || this.Idata.Email.toString().trim()==""){
      this.toast.ShowToast("Please enter email",'e');
      return false;
    }
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.Idata.Email)==false  && this.UType == 2) {
      // alert("Please Choose UserType")
      // this.helper.ShowAlert("Please enter valid email!", "top-end", "warning");
      this.toast.ShowToast("Please enter valid email!","e");
     return false;
      //this.route.navigate(['verifyEmail']);
    }

    if(this.Idata.Password=="" || this.Idata.Password==undefined || this.Idata.Password==null || this.Idata.Password.toString().trim()==""){
      this.toast.ShowToast("Please enter password",'e');
      return false;
    }
    if(this.helper.SignupProfilePic=="" || this.helper.SignupProfilePic==undefined || this.helper.SignupProfilePic==null || this.helper.SignupProfilePic.toString().trim()==""){
      this.toast.ShowToast("Please choose profile pic",'e');
      return false;
    }
    if(this.Privacy==false){
      this.toast.ShowToast("Accept our privacy policy & terms and conditions ",'e');
      return false;
    }
    else
    {
      return true;
    }
  }
  }
  instaUsername;
  CheckAvailability(username): Promise<Boolean> {
    return new Promise((resolve, error) => {

      if (username != undefined && username != "") {
        let v;
        this.Apihelper.get("https://www.instagram.com/web/search/topsearch/?query=" + username).then((data) => {
         if(data !=undefined){
        let d = data.users.length > 0;
         

          return resolve(d)
         }
        })
      }

    })
  }

  async CheckFollowers(): Promise<any> {
    let username=this.Idata.SocialUserName;
    let loading = await this.loading.create({
      message: "Verifying Please Wait"
    });
    if(username !=""){

    loading.present();
    this.isSocialUsernameExist(username).then((isEsist)=>{
      if(isEsist==false){
    this.CheckAvailability(username).then((data: boolean) => {

      if (data) {
        this.Apihelper.get("https://www.instagram.com/" + username + "/?__a=1").then((data: any) => {
          let d = data;
          if (d != undefined) {
            loading.dismiss();
            console.log(d);
            this.Followers = d.graphql.user.edge_followed_by.count;

            if (this.Followers < "1000") {
              // this.helper.ShowAlert("Sorry your follower is " + this.Followers+ " minimum 1000 followers required", "top-end", "error");
              this.toast.ShowToast("Sorry your follower is <b>"+ this.Followers+ "</b> minimum <b>1000</b> followers required","w");
              this.Idata.SocialUserName="";
              this.Followers="0"
              this.Idata.followercount=""
              loading.dismiss();
            }
            else {
              // this.helper.ShowAlert(+ this.Followers +  " Folowers. Now you can join our community", "top-end", "success");
              this.toast.ShowToast(+ this.Followers +  " Folowers. Now you can join our community",'s');
              loading.dismiss();
              document.getElementById("btn_verify").style.backgroundColor="#16d94a";
              document.getElementById("btn_verify").innerText="Verified";
              return this.Followers;
            }
          }
        }, (errr) => {
          if (errr.status == 404) {
            // this.helper.ShowAlert(".", "top-end", "warning");
         loading.dismiss();
          }
        })

      }
      else {
        // this.helper.ShowAlert("Username Not Found", "top-end", "warning");
        this.toast.ShowToast("Username not found","e");
        loading.dismiss();
      }





    },(error)=>{
      console.log(error);
      loading.dismiss();
    })
  }
  else
  {
    this.toast.ShowToast("Instagram account already registered!",'e');
    loading.dismiss();
  }
  })
  }
  else{
    // this.helper.ShowAlert("Please enter instagram username to verify", "top-end", "warning");
    this.toast.ShowToast("Please enter instagram username to verify",'e');
    loading.dismiss();
   
  }
  }


  Verification = [];


  ClearTextBox(UserType) {

    if (UserType == 1) {

      this.Bdata.FirstName = ""
      this.SelectedUser = undefined;
      this.Bdata.LastName = "";
      //this.Bdata.UserType = 1;
      this.Bdata.UserName = "";
      this.Bdata.Email = "";
      this.Bdata.Password = "";
      this.Bdata.SocialUserName = "";
      //this.Bdata.SocialType = -1;


    }
    if (UserType == 2) {

      this.Idata.FirstName = ""
      // this.SelectedUser = 'bizman';
      this.Idata.LastName = "";
      // this.Idata.UserType = "1";
      this.Idata.UserName = "";
      this.Idata.Email = "";
      this.Idata.Password = "";
      this.Idata.SocialUserName = "";
      this.Idata.SocialType = "-1";
      this.SelectedPlatform = "";
    }
  }

  SendVerificationEmail(To, Token,Name) {
    return new Promise((resolve,reject)=>{

   
    this.Apihelper.get("https://bizbay.000webhostapp.com/sendEmail.php?To=" + To + "&Token=" + Token+"&Name="+Name).then((data) => {
      let d = data;
      if (d.status == 1) {
        // this.helper.ShowAlert("Email Verification Code Sent To Your Email", "top-end", "success");
        
        return resolve(true);
      }
      else if (d.status == 0 && d.errerID == 1) {
        // this.helper.ShowAlert("Verification Code sent Faild", "top-end", "error");
        // this.toast.ShowToast("Verification Code sent Faild","e");
        return resolve(false);
      }
    })
  })
  }


  goto_Login(){
    this.route.navigate(['login']);
  }

  async presentActionSheet() {
    let actionSheet =await this.actCtrl.create({
      
      buttons: [
        {
          text: 'Take a picture',
          handler: () => {
            this.imageCaptured();
          }
        },
        {
          text: 'Choose picture',
          handler: () => {
            this.imageCapturedGallery();
          }
        }
      ]
    });
    actionSheet.present();
  }



  
  imageCapturedGallery() {
    const options: CameraOptions = {
      quality: 70,
      // targetHeight:400,
      // targetWidth:400,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    this.camera.getPicture(options).then(ImageData => {
      this.helper.SignupProfilePic = "data:image/jpeg;base64," + ImageData;
  })
  
  }

  imageCaptured() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((ImageData => {
      // this.base64img = "data:image/jpeg;base64," + ImageData;
      this.helper.SignupProfilePic = "data:image/jpeg;base64," + ImageData;

    }), error => {
      console.log(error);
    })
  }
  
  async UploadProfilePic(){
  
    return new Promise((resolve,reject)=>{
      if(this.helper.SignupProfilePic.startsWith('data')){
      this.api.UploadProfilePicToFirebase(this.helper.SignupProfilePic).then((imagepath:any)=>{
        if(imagepath !=undefined){
        
          this.helper.SignupProfilePic=imagepath;
          this.Bdata.ProfilePic=imagepath;
          return resolve(imagepath);
        }
        else
        {        
          // alert("Image Upload Failed");
          console.log("Image Upload Faild")
        }
      },(error)=>{
        return reject(error);
      })
    }
    else{
      let pic="";
      return resolve(pic);
    }
    })
  
  }

  async RegisterBiz(){
    if (this.CheckBDataValidation()==false) {
    }
    else {
    
      let loading = await this.loading.create({
        message: "Processing Please Wait..."
      });
      loading.present();
      this.isEmailExist(this.Bdata.Email).then((isExist)=>{
        if(isExist==false){
     this.UploadProfilePic().then((imagepath:string)=>{
     this.ImagePath=imagepath==""?"":imagepath;
      this.api.RegisterUser(this.Bdata).then(res=>{
        if(res !=undefined){
          this.api.getUserById(res.key).valueChanges().subscribe(user=>{
            if(user.isVerified == "0" && user.UserType == "1"){
              loading.dismiss();
              this.local.set("AuthKey",res.key);
              this.helper.userData={
                $key:res.key,
                FirstName: user.FirstName,
                LastName: user.LastName,
                UserName: user.UserName,
                Password: user.Password,
                Email: user.Email,
                Address: user.Address,
                City: user.City,
                Cellno: user.Cellno,
                ProfilePic: this.ImagePath,
                ModifiedOn:user.ModifiedOn,
                SocialType:user.SocialType,
                SocialUserName:user.SocialUserName,
                UserType:user.UserType,
                CompanyName: user.CompanyName,
                IsActive: user.IsActive,
                followercount:user.followercount,
                isVerified:user.isVerified,
                Token:user.Token,
                CreatedOn:user.CreatedOn,  
                Rating:user.Rating,
                OrderCount:user.OrderCount,
                TotalStars:user.TotalStars,
                fcmToken:user.fcmToken
              }
             this.SendVerificationEmail(user.Email, user.Token,user.FirstName).then((isSent)=>{
               if(isSent==true){
            this.local.set("userData", this.helper.userData);
            this.navCtrl.navigateForward('/verifyEmail');
            this.toast.ShowToast("Account Verification Code Sent to Your Email",'s');
            this.ClearTextBox(this.UType);
               }
               else
               {
                this.toast.ShowToast("Something went wrong",'e');
               }
          });
            }
            
           
          })
        }
        else{
          // this.helper.ShowAlert("Registration Faild","top-end","error"); 
          this.toast.ShowToast("Registration Faild!","e"); 
          loading.dismiss();
        }

      }).catch(error =>
        {
           console.log(error)
           loading.dismiss();
          });   
        })
      
      // }
      // else{
      //   this.toast.ShowToast("Email already registered!.","e"); 

      // }
    }
    else{
      this.toast.ShowToast("Email already registered!.","e"); 
      loading.dismiss();
    }
  })
    }
  }

  async RegisterInflauncer(){
    if (this.CheckIDataValidation()==false) {

    }
    else {

      if (this.UType == "2" && this.Followers != undefined && this.Followers !="0") {
        let loading = await this.loading.create({
          message: "Processing Please Wait..."
        });
        loading.present();
        this.isEmailExist(this.Idata.Email).then((isExist)=>{
          if(isExist==false){
        this.Idata.followercount=this.Followers;
        this.UploadProfilePic().then((imagepath:string)=>{
          this.ImagePath=imagepath==""?"":imagepath;
        this.api.RegisterUser(this.Idata).then(res=>{
          if(res !=undefined){
            this.api.getUserById(res.key).valueChanges().subscribe(user=>{
              if(user.isVerified == "0" && user.UserType == "2"){
                loading.dismiss();
                this.local.set("AuthKey",res.key);
                this.helper.userData={
                  $key:res.key,
                  FirstName: user.FirstName,
                  LastName: user.LastName,
                  UserName: user.UserName,
                  Password: user.Password,
                  Email: user.Email,
                  Address: user.Address,
                  City: user.City,
                  Cellno: user.Cellno,
                  ProfilePic: this.ImagePath,
                  ModifiedOn:user.ModifiedOn,
                  SocialType:user.SocialType,
                  SocialUserName:user.SocialUserName,
                  UserType:user.UserType,
                  CompanyName: user.CompanyName,
                  IsActive: user.IsActive,
                  followercount:user.followercount,
                  isVerified:user.isVerified,
                  Token:user.Token,
                  CreatedOn:user.CreatedOn,  
                  Rating:user.Rating,
                OrderCount:user.OrderCount,
                TotalStars:user.TotalStars,
                fcmToken:user.fcmToken
                }
               this.SendVerificationEmail(user.Email, user.Token,user.FirstName);
              this.local.set("userData", this.helper.userData);
              this.navCtrl.navigateForward('/verifyEmail');
              // this.helper.ShowAlert("Account Verification Code Sent to Your Email","top-end","success");
            this.toast.ShowToast("Account Verification Code Sent to Your Email",'s');
              //this.navCtrl.navigateForward('/inflancerdash');
              //this.SignInForm();
              this.ClearTextBox(this.UType);
              }
            })
          }
          else{
            // this.helper.ShowAlert("Registration Faild","top-end","error"); 
            this.toast.ShowToast("Registration Faild","e"); 
            loading.dismiss();
          }
        }).catch(error =>
          {
             console.log(error)
             loading.dismiss();
            });   
          })
        }
        else
        {
          this.toast.ShowToast("Email already registered!","e"); 
          loading.dismiss();
        }

        })
 
      }
      else {
        // this.helper.ShowAlert("Please first check followers counts!", "top-end", "warning");
        this.toast.ShowToast("Please first check followers counts!","e");
        
      }
    }  
  }

  ShowPrivacyPolicy(){
    $('#exampleModalScrollable').modal('show');
    $('.modal').remove();
    // $('.modal-backdrop').remove();
    // $('#exampleModalScrollable').removeClass('modal-backdrop');
  }

  HidePrivacyPolicy(){
     $('#exampleModalScrollable').modal('hide');
    // $('.modal').remove();
      //$('.modal-backdrop').remove();
    //$().hide();
     //$('#exampleModalScrollable').removeClass('modal-backdrop');
  }

  isEmailExist(Email){
  return new Promise((resolve,reject)=>{
    this.api.isEmailRegistered(Email).then((data:boolean)=>{
      if(data==true){
      return resolve(true);
      }
      else
      {
        return resolve(false)
      }
    })
  })
  }

  isSocialUsernameExist(username){
    return new Promise((resolve,reject)=>{
    this.api.isSocialUsernameRegistered(username).then((data:boolean)=>{
      if(data==true){
        return resolve(true);
      }
      else
      {
        return resolve(false)
      }
    })
  })
  }







}
