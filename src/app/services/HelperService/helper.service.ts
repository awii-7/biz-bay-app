import { Injectable } from '@angular/core';
import Swal from "sweetalert2"
import { LoadingController, MenuController } from '@ionic/angular';
import {EmailComposer} from '@ionic-native/email-composer/ngx'
import { from } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { ApiHelperService } from '../api-helper.service';
import { LocalStorageService } from '../local-storage.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  activeProposal="";
PageName="";
Days;
baseUrl:any="https://bizbayapp.000webhostapp.com/bizbayApp/";
defaultPic="https://firebasestorage.googleapis.com/v0/b/bizbay-70d0a.appspot.com/o/UsersProfiles%2Fpngs.png?alt=media&token=c7d46e8a-d545-4c1d-a880-d0e40643baad";
Day=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
imagepath:any;
SignupProfilePic="";
TotalPosts=0;
userData={
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
  Rating:0.0,
  OrderCount:0,
  TotalStars:0,
  fcmToken:""
}
Rating;
sendPorposalData:any;
orderData:any;
Modal={
  userModal:false,
postModal:false,
proposalModal:false
}
  constructor(
    public loading:LoadingController,
    public Apihelper:ApiHelperService,
    public local:LocalStorageService,
    public menu:MenuController
  ) { }

  ShowAlert(Message, Position, icon) {
    return new Promise((resolve, error) => {
      let Toast = Swal.mixin({
        toast: true,
        //width:200,
        //padding:20,

        position: Position,
        showConfirmButton: false,
        timer: 3000
      });

      Toast.fire({
        icon: icon,
        title: Message,


      })

    })
  }

  ValidateData(obj){

    if(obj.isEmpty()) {
      
      this.ShowAlert('Please Fill All Field','top-end','warning');
  } else {
      return true;
  }
  }

  
  GetDaysofRegistration(Dates:any)
{
  let date=new Date(Dates);
  let Days= Math.abs(date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) ;
  this.Days= Number(Days.toFixed(1));
  return Days;
}

GenerateToken(){
  return Math.floor(100000 + Math.random() * 900000).toString();
}


SendResetPasswordCode(To,Token,Name):Promise<any>{
  
  return new Promise((resolve, reject) => {
    this.Apihelper.get("https://bizbay.000webhostapp.com/resetPassword.php?To=" + To + "&Token=" + Token+"&Name="+Name).then((data) => {
      let d = data;
      if (d.status == 1) {
        return resolve(true);
      }
      else if (d.status == 0 && d.errerID == 1) {
        return resolve(false);
      }
    },(error)=>{
      return resolve(false);
    })
  })
}

PasswordChangedSuccessMsg(To,Name):Promise<any>{
  
  return new Promise((resolve, reject) => {
    this.Apihelper.get("https://bizbay.000webhostapp.com/passwordchangedemail.php?To="+To+"&Name="+Name).then((data) => {
      let d = data;
      if (d.status == 1) {
        return resolve(true);
      }
      else if (d.status == 0 && d.errerID == 1) {
        return resolve(false);
      }
    },(error)=>{
      return resolve(false);
    })
  })
}

 ValidateEmail(mail:string) 
{
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
  {
    return (true)
  }
    // alert("You have entered an invalid email address!")
    return (false)
}

getUserdata(){
  this.local.get("userData").then((data)=>{
    if(data !=null){
     return this.userData=data;
    }
  })
}


public setPerposalData(data) {
  this.sendPorposalData = data;
}

getPerposalData(type:string) {
  return new Promise((resolve,reject)=>{
    if(type=='all')
    {
    return resolve(this.sendPorposalData);
    }
    if (type=='user')
    {
    return resolve(this.sendPorposalData);
    }
     if(type=='bizman')
    {
    return resolve(this.sendPorposalData.Post_Created_By);
    }
     if(type=='post')
    {
    return resolve(this.sendPorposalData);
    }
    else
    {
      return resolve(null)
    }
  })

}

formatCount(value) {
  var newValue = value;
  if (value >= 1000) {
      var suffixes = ["", "K", "M", "B","T"];
      var suffixNum = Math.floor( (""+value).length/3 );
      var shortValue = '';
      for (var precision = 2; precision >= 1; precision--) {
          shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision)).toString();
          var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
          if (dotLessShortValue.length <= 2) { break; }
      }
      if (parseFloat(shortValue) % 1 != 0)  shortValue =parseFloat(shortValue).toFixed(1);
      newValue = shortValue+suffixes[suffixNum];
  }
  return newValue;
}

formateDatePK(){
  var d=moment().format('DD-MM-YYYY hh:mm:ss A').toString();
  return d;
}

formateDat(CreatedDateTime){
  var d=moment(CreatedDateTime,"DD-MM-YYYY hh:mm:ss A").minutes().toString();
  return Number(d);
}
addDaystoCurrentDate(number_of_days) {
  var d=moment().add(number_of_days,'d').format('DD-MM-YYYY hh:mm:ss A').toString();
    return d;
}

setOrderData(data){
  this.orderData=data
}
getOrderData(){
  return this.orderData;
}

RelativeTime(datetime){
  var date = moment(datetime, "DD-MM-YYYY hh:mm:ss A").fromNow();
  //  var time= moment(moment(datetime).format("DD-MM-YYYY hh:mm:ss A")).fromNow();
   return date;
  }
  GenerateUniqueID() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 12; i++){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  GenerateBalance() {
    let text = "";
    let possible = "123456789";
    for (let i = 0; i < 5; i++){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return Number(text);
  }

  CalculateAdminTax(total){
      return ((5/ 100) * total);
  }

  OrderID;
  setOrderID(id){
    this.OrderID=id;
  }
  getOrderID(){
    return this.OrderID;
  }
  OrderPlaceEmail_Bizman(To,Name,OrderNo,CreateDate:string,DeleveryDate:string,Price,Deleverin:string,Greeting):Promise<any>{
   let create= CreateDate.split(" ")[0]
   let delever= DeleveryDate.split(" ")[0]
   console.log(Deleverin);
    return new Promise((resolve, reject) => {
      this.Apihelper.get("https://bizbay.000webhostapp.com/OrderPlaceEmail_bizman.php?To="+To+"&Name="+Name+
      "&OrderNo="+OrderNo+"&CreateDate="+create+"&DeleveryDate="+delever+"&Price="+Price+"&Deleverin="+Deleverin+"&Greeting="+Greeting
      ).then((data) => {
        let d = data;
        if (d.status == 1) {
          console.log("Order placed email sent")
          return resolve(true);
          
        }
        else if (d.status == 0 && d.errerID == 1) {
          console.log("Order placed email not sent")
          return resolve(false);
        }
      },(error)=>{
        return resolve(false);
      })
    })
  }

  
  NewOrderEmail_Influencer(To,Name):Promise<any>{
  
    return new Promise((resolve, reject) => {
      this.Apihelper.get("https://bizbay.000webhostapp.com/passwordchangedemail.php?To="+To+"&Name="+Name).then((data) => {
        let d = data;
        if (d.status == 1) {
          return resolve(true);
        }
        else if (d.status == 0 && d.errerID == 1) {
          return resolve(false);
        }
      },(error)=>{
        return resolve(false);
      })
    })
  }

   generateGreetings(){

    var currentHour =Number(moment().format("HH"));

  
    if (currentHour >= 3 && currentHour < 12){
        return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 15){
        return "Good Afternoon";
    }   else if (currentHour >= 15 && currentHour < 20){
        return "Good Evening";
    } else if (currentHour >= 20 && currentHour < 3){
        return "Good Night";
    } else {
        return "Hello"
    }
  
  }

  ShowMenu(){
    this.menu.toggle();
  }


  token;
  setToken(token){
    this.token=token;
  }
  gettoken(){
    return this.token;
  }
  



   
  
  
}
