export class UsersRegistration{
    $key?:string;
    FirstName:string;
    LastName: string;
    UserType?: string;// 1-Buisnessman  2-Inflaucer 3- Admin
    UserName: string;
    Password: string;
    Email: string;
    SocialUserName?: string;
    SocialType?: string;// 1 - Insta  2- Twitter -3 Facebook
    Address: string;
    City:string;
    Cellno: string;
    CompanyName?: string;
    IsActive?: string;
    followercount?: string;
    isVerified?: string;
    ProfilePic:string;
    Token?:string;
    Rating?:any;
    OrderCount?:number;
    TotalStars?:number
    CreatedOn?:string;
    ModifiedOn:string;
    fcmToken:string;
}