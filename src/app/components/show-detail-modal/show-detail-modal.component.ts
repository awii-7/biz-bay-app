import { Component, OnInit } from '@angular/core';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { Ranking } from 'src/app/models/userRanking';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-show-detail-modal',
  templateUrl: './show-detail-modal.component.html',
  styleUrls: ['./show-detail-modal.component.scss'],
})
export class ShowDetailModalComponent implements OnInit {
  ranking = this.api.getRankingList();
UserDetail;
PostDetail;
ProposalDetail;
userRanking;
  constructor(
    public actionCtrl:ActionSheetController,
    public api:ApiService,
    public loading:LoadingController,
    public nav:NavService,
    public helper:HelperService,
    public toast:ToastService,
    public modal:ModalController
  ) {
     this.helper.getPerposalData('user').then((data)=>{
      this.UserDetail=data
    });

    this.helper.getPerposalData('post').then((data)=>{
      this.PostDetail=data
    });
    this.helper.getPerposalData('all').then((data)=>{
      this.ProposalDetail=data
    });
    

   }

  async ngOnInit() {

    // this.ranking.snapshotChanges().subscribe(result => {
    //   this.userRanking = [];
    //   let tempArr = [];
    //   result.forEach(item => {
    //     let a = item.payload.toJSON();
    //     a['$key'] = item.key;
    //     this.userRanking.push(a as Ranking);
    //   })
    // })

   
  }

  GetRanking(user) {

    this.api.GetRanking(user).then(u => {
      let usr: any = u;
      if (usr != false) {
        let key: any = Object.keys(usr)[0];
        let user = usr[key];
        this.userRanking = user

        this.Orders=this.userRanking.TotalOrder;
        this.Rating=this.userRanking.Rating;
        // this.GetOrder();
        // this.GetRating();
        // this.GetTotalStars();
      }

    })
  }

  TotalStars=0;
  GetTotalStars() {
    let Stars = this.userRanking.filter(x => x.InflauncerID == this.UserDetail.key)[0];
    if (Stars != undefined) {
      this.TotalStars= Stars.TotalStars;
    }
    else {
      this.TotalStars=0;
    }
  }
Rating=0.0;
  GetRating(id?) {
    let Rating = this.userRanking.filter(x => x.InflauncerID == this.UserDetail.key)[0];
    if (Rating != undefined) {
      this.Rating= Rating.Rating;
    }
    else {
      this.Rating=0.0;
    }
  }

  Orders=0;
  GetOrder(id?) {
    let Order = this.userRanking.filter(x => x.InflauncerID == this.UserDetail.key)[0];
    if (Order != undefined) {
      this.Orders= Order.TotalOrder;
    }
    else {
      this.Orders=0;
    }
  }



  

























  

}
