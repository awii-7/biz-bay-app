import { Component, OnInit } from '@angular/core';
import { influencerReviews } from 'src/app/models/influencerReviews';
import { notifications } from 'src/app/models/notifications';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-review-order',
  templateUrl: './review-order.page.html',
  styleUrls: ['./review-order.page.scss'],
})
export class ReviewOrderPage implements OnInit {

  orderData:any;
  orderId:any;
  userData:any
  Review={
    Review:"",
    Rating:0,
    ReviewStatus:""
  }
  constructor(
    public helper:HelperService,
    public api:ApiService,
    public toast:ToastService,
    public nav:NavService
  ) {
    this.Review.ReviewStatus="Excellent"
    this.orderData=this.helper.getOrderData();
    this.orderId=this.helper.getOrderID();
    console.log(this.orderData)
   }

  ngOnInit() {
    this.api.getUserByIds(this.orderData.InfluencerID).then((user)=>{
      if(user){
        this.userData=user;
        console.log(this.userData)
      }
    })
  }

  logRatingChange(evt){
    this.Review.Rating=evt;
  }

  SubmitReview(){
    if(this.Review.Review==undefined || this.Review.Review==""){
      this.toast.ShowToast("Please Write comment",'e');
    }
    else
    {
      let review:influencerReviews={
        CreatedDateTime:this.helper.formateDatePK(),
        ModifiedOn:"",
        OrderID:this.orderId,
        Rating:this.Review.Rating,
        Review:this.Review.Review,
        ReviewStatus:this.Review.ReviewStatus,
        isActive:true,
        isDeleted:false,
        ReviewFromID:this.orderData.BizmanID,
        ReviewFromName:this.orderData.BizmanName,
        ReviewToName:this.orderData.InfluencerName,
        ReviewsTo:this.orderData.InfluencerID,
        Status:"C",
      }
      this.api.SubmitReview(review).then((data)=>{
        if(data){

          this.toast.ShowToast("Review submit successfully",'s');
          this.UpdateOrderSubmit();
          this.SaveNotification();
          this.nav.goto_bizdash();
        }
      })
    }
  }


  UpdateOrderSubmit(){
    let key=this.orderId;
    let obj={
       isSubmited:true,
       ModifiedOn:this.helper.formateDatePK(),
       WaitingForReview:false,
       isReviewed:true,
       Status:"D",
       RemainingDateTime:this.helper.formateDatePK()
    }
    this.api.UpdateOrderFinalStatus(key,obj).then((data)=>{
      if(data){ 
        this.UpdateInfluencerOrderRating();
      }
    })
  }


  UpdateInfluencerOrderRating(){
    let key=this.orderData.InfluencerID;
    let TotalStars=Number(this.userData.TotalStars)+Number(this.Review.Rating);
    let OrderCount=Number(this.userData.OrderCount)+1
    let Rating = (TotalStars/OrderCount).toFixed(1);
    let obj={
      TotalStars:TotalStars,
      Rating:Rating,
      OrderCount:OrderCount,
      ModifiedOn:this.helper.formateDatePK()
    }
    this.api.UpdateInfluencerOrderRating(key,obj).then((data)=>{
      console.log("Influencer Updated" + obj);
    })
  }

  SaveNotification(){
      let n:notifications={
        $key:"",
        Title:"Bisnessman Reviews",
        Message:this.Review.Review+ " | "+this.Review.Rating,
        InfluencerID:this.orderData.InfluencerID,
        InfluencerName:this.orderData.InfluencerName,
        PostID:"",
        ProposalID:"",
        OrderID:this.orderId,
        BizmanID:this.orderData.BizmanID,
        BizmanName:this.orderData.BizmanName,
        Status:"P",
        Type:"orderReview",
        isSeen:false,
        UserType:'2',
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
