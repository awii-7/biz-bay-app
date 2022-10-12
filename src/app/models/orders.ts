export class order {
    $key: string;
    OrderNo?:string;
    Price:string;
    DeleveryDate:string;
    DeleverInDays:string;
    Title:string;
    RemainingDateTime:string;
    InfluencerID?:string;
    InfluencerName?:string;
    PostID?:string;
    ProposalID?:string;
    BizmanID?:string;
    BizmanName?:string;
    ProgressPercentage:string;
    Comments?:any;
    Status?:string;
    isReviewed:boolean;
    WaitingForReview:boolean;
    isSubmited:boolean;
    isDeleted:boolean;
    isActive:boolean;
    OrderCreatedDateTime:string;
    ModifiedOn:string;
}