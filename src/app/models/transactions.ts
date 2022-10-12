export class Transactions {
    key?: string;
    OrderId:string;
    PaymentType:number; //1-Credit Card 2-Net-Banking 3-Easypaisa/Jazzcash
    TransactionType:string; //Order , OrderCancelled
    OrderAmount:number;
    AdminTax:number;
    FinalAmount:number;
    DeleverToAdmin:boolean;
    DeleverToInfluencer:boolean;
    ReturnToBizman:boolean;
    InfluencerID:string;
    BizmanID:string;
    AdminID:string;
    CreditCardID:string;
    isActive:boolean;
    CreatedDateTime:string;
    ModifiedOn:string;
    BizmanName:string;
    InfluencerName:string;
}