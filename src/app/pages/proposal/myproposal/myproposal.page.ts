import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NavService } from 'src/app/services/Navigation/nav.service';

@Component({
  selector: 'app-myproposal',
  templateUrl: './myproposal.page.html',
  styleUrls: ['./myproposal.page.scss'],
})
export class MyproposalPage implements OnInit {
  ProposalList = [];
  TempProposalList=[];
  segment;
  constructor(
    private api:ApiService,
    private helper:HelperService,
    private local:LocalStorageService,
    private nav:NavService
    
  ) {
    this.segment="all"
   }

  ngOnInit() {
    // this.postForm = this.fb.group({
    //   title: [''],
    //   type: [''],
    // })
    this.api.NotifBadge()
    this.local.get("AuthKey").then(key=>{
      if(key !=undefined){
      let proposal=this.api.getProposalList();
      proposal.snapshotChanges().subscribe(res => {
          this.ProposalList= [];
          this.TempProposalList=[];
          res.forEach(item => {
            let a = item.payload.toJSON();
            a['$key'] = item.key;
            this.api.isProposalSeen(item.key).then((data:any)=>{
            
              a['isSeen']=data.isSeen
              this.TempProposalList.push(a);
              if(this.TempProposalList.length !=0){
                this.ProposalList=this.TempProposalList.filter(x=>x.Porposal_Sent_By.key==key && x.isActive===true);
                // this.helper.TotalPosts=this.ProposalList.length;
                }
            })
            
            
            // for (let index = 0; index < this.TempProposalList.length; index++) {        
            // }

          })
        })
      }
  })
}


isSeen(ProposalID){
  this.api.isProposalSeen(ProposalID).then((data:any)=>{
    if(data !=null){
      
      if(data.isSeen==true){
        return "Seen"
      }
      else if(data.isSeen==false){
        return "Delevered"
      }
    
    }
  })
}

delete(id) {
  console.log(id)
  if (window.confirm('Do you really want to delete?')) {
    this.api.deleteProposal(id)
  }
}

segmentChanged(evt){
  // this.ProposalList=[]
  let value=evt.detail.value;
  if(value=="pending"){
   let isProposal= this.ProposalList.filter(x=>x.Status=="P").length;
   console.log("Pending Proposal "+ isProposal)
   return isProposal;
  }
  if(value=="rejected"){
    let isProposal= this.ProposalList.filter(x=>x.Status=="R").length;
   console.log("Rejected Proposal "+ isProposal)
    return isProposal;
  }
  if(value=="approved"){
    let isProposal= this.ProposalList.filter(x=>x.Status=="C").length;
   console.log("Approved Proposal "+ isProposal)
    return isProposal;
  }
}

}
