import { Injectable, Query } from "@angular/core";
import { Posts } from "../models/posts";
import { UsersRegistration } from "../models/usersRegistration";
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
  QueryFn,
} from "@angular/fire/database";
import { AngularFireStorage } from "@angular/fire/storage";
import { LocalStorageService } from "./local-storage.service";
import { HelperService } from "./HelperService/helper.service";
import { PostComments } from "../models/postComments";
import { BehaviorSubject } from "rxjs";
import { Platform } from "@ionic/angular";
import { environment } from "src/environments/environment";
import { PostLike } from "../models/postLike";
import { Device } from "@ionic-native/device/ngx";
import { Porposal } from "../models/proposal";
import { notifications } from "../models/notifications";
import { order } from "../models/orders";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase";
import { Rooms } from "../models/rooms";
import { Transactions } from "../models/transactions";
import { influencerReviews } from "../models/influencerReviews";
import { eWallet } from "../models/eWallet";
// import * as firebase from 'firebase';

@Injectable({
  providedIn: "root",
})
export class ApiService {
  postList: AngularFireList<any>;
  proposalList: AngularFireList<any>;
  notificationList: AngularFireList<any>;
  postRef: AngularFireObject<any>;
  LikedpostRef: AngularFireObject<any>;
  ref: QueryFn;
  // db =firebase.default.firestore();

  //USERS
  UserList: AngularFireList<any>;
  CardList: AngularFireList<any>;
  RankingList: AngularFireList<any>;
  UserByID: AngularFireObject<any>;
  authState = new BehaviorSubject(false);

  constructor(
    private database: AngularFireDatabase,
    private storage: AngularFireStorage,
    private local: LocalStorageService,
    private helper: HelperService,
    private platform: Platform,
    private device: Device,
    private afs: AngularFirestore
  ) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
      //Getting Server Timestamp
      // firebase.default.firestore.FieldValue.serverTimestamp();
    });
  }

  // Create
  createPost(post: Posts) {
    return new Promise((resolve, reject) => {
      let Result;
      this.local.get("AuthKey").then(
        (key) => {
          if (key != undefined) {
            this.postList = this.database.list("/posts");
            Result = this.postList.push({
              Title: post.Title,
              Description: post.Description,
              Price: post.Price,
              Tags: post.Tags,
              ViewCount: post.ViewCount,
              TotalLike: post.TotalLike,
              Images: post.Images,
              UserId: post.UserId,
              UserName: post.UserName,
              Status: post.Status,
              CreatedDateTime: this.helper.formateDatePK(),
              ModefiedDateTime: post.ModefiedDateTime,
            });
            return resolve(Result);
          }
        },
        (error) => {
          return reject(error);
        }
      );
    });
  }

  UpdatePost(id: string, post: Posts): Promise<any> {
    if (post != undefined) {
      return new Promise((resolve, reject) => {
        let Views = Number(post.ViewCount);
        let obj = {
          ViewCount: Views + 1,
          ModefiedDateTime: this.helper.formateDatePK(),
        };
        this.database
          .list("/posts")
          .update(id, obj)
          .then((result: any) => {
            console.log(result);
          });

        // this.postRef.update({
        //   Title: post.Title,
        //       Description: post.Description,
        //       Price: post.Price,
        //       Tags: post.Tags,
        //       ViewCount: Views+1,
        //       TotalLike:post.TotalLike,
        //       Images: post.Images,
        //       UserId: post.UserId,
        //       UserName:post.UserName,
        //       Status: post.Status,
        //       CreatedDateTime: post.CreatedDateTime,
        //       ModefiedDateTime: this.helper.format,

        // }
        // ).then(() => {
        //   return resolve(true)
        // }).catch(() => {
        //   return reject(false);
        // })
      });
    }
  }

  UpdateLikeInPost(id: string, post: Posts): Promise<any> {
    if (post != undefined) {
      return new Promise((resolve, reject) => {
        let Likes = Number(post.TotalLike);
        let obj = {
          TotalLike: Likes + 1,
          ModefiedDateTime: this.helper.formateDatePK(),
        };
        this.database.list("/posts").update(id, obj);
      });
    }
  }
  LikeRemovedPost(id: string, post: Posts): Promise<any> {
    if (post != undefined) {
      return new Promise((resolve, reject) => {
        let Likes = Number(post.TotalLike);
        let obj = {
          TotalLike: Likes - 1,
          ModefiedDateTime: this.helper.formateDatePK(),
        };
        this.database.list("/posts").update(id, obj);
      });
    }
  }

  // Get List
  getPostList() {
    this.postList = this.database.list("/posts");
    return this.postList;
  }

 

  getInflauncerList() {
    this.UserList = this.database.list("/users");
    return this.UserList;
  }

  getRankingList() {
    this.RankingList = this.database.list("/userranking");
    return this.RankingList;
  }

  getNotificationList() {
    this.notificationList = this.database.list("/notifications");
    return this.notificationList;
  }

  //   GetAllPostByID(key) {
  //     return new Promise((resolve, reject) => {
  //       this.database.database.ref('/posts/').orderByChild('UserId').equalTo(key).once('value', (snapshot) => {

  //         let Catdata = snapshot.val();
  //           let temparr = [];
  //           for (var key in Catdata) {
  //               temparr.push(Catdata[key]);
  //           }
  //                return resolve(temparr);

  //           })
  //     })

  // }

  // Delete
  deletePost(id: string) {
    this.postRef = this.database.object("/posts/" + id);
    this.postRef.remove();
  }
  deleteProposal(id: string) {
    this.database.object("/proposals/" + id).remove();
  }
  deleteLikedPost(id: string) {
    this.postRef = this.database.object("/postlike/" + id);
    this.postRef.remove();
  }

  deleteNotification(id: string) {
    let a = this.database.object("/notifications/" + id);
    a.remove();
  }

  RegisterUser(u: UsersRegistration) {
    this.UserList = this.database.list("/users");
    return this.UserList.push({
      FirstName: u.FirstName,
      LastName: u.LastName,
      SocialType: u.SocialType, // 1 - Insta (Current)  2- Twitter -3 Facebook
      UserName: u.UserName,
      Password: u.Password,
      Email: u.Email,
      SocialUserName: u.SocialUserName,
      UserType: u.UserType, // 1-Buisnessman  2-Inflaucer 3- Admin
      Address: u.Address,
      City: u.City,
      Cellno: u.Cellno,
      CompanyName: u.CompanyName,
      IsActive: u.IsActive,
      followercount: u.followercount,
      isVerified: u.isVerified,
      ProfilePic: u.ProfilePic,
      Token: u.Token,
      CreatedOn: this.helper.formateDatePK(),
      ModifiedOn: u.ModifiedOn,
      Rating: u.Rating,
      OrderCount: u.OrderCount,
      TotalStars: u.TotalStars,
      fcmToken: u.fcmToken,
    });
  }

  Comments(Comment: PostComments) {
    this.postList = this.database.list("/postcomments");
    return this.postList.push({
      Comment: Comment.Comment,
      CommentDate: Comment.CommentDate,
      CommentTime: Comment.CommentTime,
      PostID: Comment.PostID,
      CommentedByName: Comment.CommentedByName,
      CommentedByID: Comment.CommentedByID,
      CreatedDateTime: Comment.CreatedDateTime,
    });
  }

  // Get Single
  getUserById(id: string) {
    this.UserByID = this.database.object("/users/" + id);
    return this.UserByID;
  }

  getUserByIds(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.UserByID = this.database.object("/users/" + id);
      this.UserByID.valueChanges().subscribe((user) => {
        return resolve(user);
      });
    });
  }

  // Get Single
  getPostById(id: string) {
    this.postRef = this.database.object("/posts/" + id);
    return this.postRef;
  }

  getCommentList() {
    this.postList = this.database.list("/postcomments");
    return this.postList;
  }

  getProposalList() {
    this.proposalList = this.database.list("/proposals");
    return this.proposalList;
  }

  updateUserProfile(id: string, u: UsersRegistration) {
    return new Promise((result, reject) => {
      this.UserByID.update({
        FirstName: u.FirstName,
        LastName: u.LastName,
        SocialType: u.SocialType, // 1-Buisnessman  2-Inflaucer 3- Admin
        UserName: u.UserName,
        Password: u.Password,
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
        ModifiedOn: this.helper.formateDatePK(),
        fcmToken: u.fcmToken,
      })
        .then(() => {
          return result(true);
        })
        .catch(() => {
          return reject(false);
        });
    });
  }

  VerifyUser(id: string, u: UsersRegistration): Promise<any> {
    return new Promise((resolve, reject) => {
      this.UserByID.update({
        FirstName: u.FirstName,
        LastName: u.LastName,
        SocialType: u.SocialType, // 1-Buisnessman  2-Inflaucer 3- Admin
        UserName: u.UserName,
        Password: u.Password,
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
        ModifiedOn: this.helper.formateDatePK(),
        fcmToken: u.fcmToken,
      })
        .then(() => {
          return resolve(true);
        })
        .catch(() => {
          return reject(false);
        });
    });
  }

  Login(logindata: any) {
    return new Promise((resolve, reject) => {
      let Email = logindata.Email;
      let Password = logindata.Password;
      this.database.database
        .ref("users/")
        .orderByChild("Email")
        .startAt(Email)
        .endAt(Email)
        .limitToFirst(1)
        .on("value", function (snapshot) {
          if (snapshot.val()) {
            console.log(snapshot.val());
            let A = snapshot.val();
            if (A[Object.keys(A).toString()].Password === Password) {
              return resolve(snapshot.val());
            } else {
              return resolve(false);
            }
          } else {
            return resolve(false);
          }
        });
    });
  }

  UploadPostImageToFirebase(base64img: any) {
    let date = Date.now().toString().substring(7);
    // let NEwBase64=base64img.substring(0,23);
    let messageSplit = base64img.split("data:image/jpeg;base64,")[1];
    let newbase64 = "data:image/jpg;base64," + messageSplit;
    return new Promise((resolve, reject) => {
      var path = this.storage
        .ref("/PostsImages/")
        .child(date + "post_image.jpg");
      path
        .putString(messageSplit, "base64", {
          contentType: "image/jpeg",
        })
        .then(() => {
          path.getDownloadURL().subscribe((url) => {
            if (url != undefined) {
              alert("image uploaded");
              return resolve(url);
            } else {
              alert("image Not Uploaded");
            }
            //function to save download URL of saved image in database
          });
        });
    });
  }

  UploadProfilePicToFirebase(base64img: any) {
    let date = Date.now().toString().substring(7);
    // let NEwBase64=base64img.substring(0,23);
    let messageSplit = base64img.split("data:image/jpeg;base64,")[1];
    let newbase64 = "data:image/jpg;base64," + messageSplit;
    return new Promise((resolve, reject) => {
      var path = this.storage
        .ref("/UsersProfiles/")
        .child(date + "_" + "bizbay_user.jpg");
      path
        .putString(messageSplit, "base64", {
          contentType: "image/jpeg",
        })
        .then(() => {
          path.getDownloadURL().subscribe((url) => {
            if (url != undefined) {
              // alert("image uploaded");
              return resolve(url);
            } else {
              alert("image Not Uploaded");
            }
            //function to save download URL of saved image in database
          });
        });
    });

    // storageRef.getDownloadURL().then(function(url) {
    //     imageRef.child("image").set(url);
    // });

    // var task = storageRef.putString("Your base64 string substring variable", 'base64').then(function(snapshot) {
    //      console.log('Uploaded a base64 string!');
    //      });
  }

  getInflauncer() {
    return new Promise((resolve, reject) => {
      this.database.database
        .ref("users/")
        .orderByChild("UserType")
        .equalTo("2")
        .on(
          "value",
          function (snapshot) {
            if (snapshot.val()) {
              console.log(snapshot.val());
              let A = snapshot.val();
              if (A[Object.keys(A).toString()].UserType != undefined) {
                return resolve(snapshot.val());
              } else {
                return resolve(false);
              }
            }
          },
          (error) => {
            return reject(error);
          }
        );
    });
  }

  GetRanking(ranking: any) {
    return new Promise((resolve, reject) => {
      let InflauncerID = ranking;
      this.database.database
        .ref("userranking/")
        .orderByChild("InflauncerID")
        .startAt(InflauncerID)
        .endAt(InflauncerID)
        .limitToFirst(1)
        .on("value", function (snapshot) {
          console.log(snapshot.val());
          if (snapshot.val()) {
            return resolve(snapshot.val());
          } else {
            return resolve(false);
          }
        });
    });
  }

  isLogin = false;
  ifLoggedIn() {
    this.local.get("userData").then((data) => {
      if (data) {
        this.helper.userData = data;
        this.isLogin = true;
        this.helper.setToken(this.helper.userData.fcmToken);
        this.authState.next(true);
      }
    });
  }

  isAuthenticated() {
    this.authState.subscribe((data) => {
      if (data) {
        this.local.get("userData").then((data) => {
          if (data) {
            this.helper.userData = data;
            this.helper.setToken(this.helper.userData.fcmToken);
          }
        });
      }
    });
    return this.authState.value;
  }

  ForgotPassword(Email: any) {
    let data: any;
    let Token = this.helper.GenerateToken();
    return new Promise((resolve, reject) => {
      this.database.database
        .ref("users/")
        .orderByChild("Email")
        .equalTo(Email)
        .limitToFirst(1)
        .once("value", function (snapshot) {
          if (snapshot.val()) {
            console.log(snapshot.val());
            let A = snapshot.val();
            let key: any = Object.keys(A)[0];
            let Data = A[Object.keys(A).toString()];
            if (Data.Email === Email) {
              data = {
                Email: Data.Email,
                Token: Token,
                Name: Data.FirstName,
                key: key,
              };
              return resolve(data);
            } else {
              return resolve(false);
            }
          } else {
            return resolve(false);
          }
        });
    });
  }

  UpdatePassword(id: string, u: UsersRegistration) {
    return new Promise((result, reject) => {
      this.UserByID.update({
        FirstName: u.FirstName,
        LastName: u.LastName,
        SocialType: u.SocialType, // 1-Buisnessman  2-Inflaucer 3- Admin
        UserName: u.UserName,
        Password: u.Password,
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
        ModifiedOn: u.ModifiedOn,
        fcmToken: u.fcmToken,
      })
        .then(() => {
          return result(true);
        })
        .catch(() => {
          return reject(false);
        });
    });
  }

  GetTotalUserCount() {
    return new Promise((resolve, reject) => {
      this.database.database.ref("/users").once("value", function (snapshot) {
        console.log(snapshot.val());
        if (snapshot.numChildren() > 0) {
          console.log(snapshot.numChildren());
          return resolve(snapshot.numChildren());
        } else {
          return resolve(false);
        }
      });
    });
  }
  GetTotalPostLikeCount(key: string) {
    return new Promise((resolve, reject) => {
      this.database.database
        .ref("/postlike")
        .orderByChild("postID")
        .equalTo(key)
        .once("value", function (snapshot) {
          console.log(snapshot.val());
          if (snapshot.numChildren() > 0) {
            console.log(snapshot.numChildren());
            return resolve(snapshot.numChildren());
          } else {
            return resolve(false);
          }
        });
    });
  }
  isEmailRegistered(Email: any) {
    let data: any;
    let Token = this.helper.GenerateToken();
    return new Promise((resolve, reject) => {
      this.database.database
        .ref("users/")
        .orderByChild("Email")
        .equalTo(Email)
        .limitToFirst(1)
        .once("value", function (snapshot) {
          let A = snapshot.val();
          if (snapshot.val()) {
            let key: any = Object.keys(A)[0];
            let Data = A[Object.keys(A).toString()];
            if (Data.Email == Email) {
              return resolve(true);
            } else {
              return resolve(false);
            }
          } else if (A == null) {
            return resolve(false);
          }
        });
    });
  }

  isUsernameRegistered(Username: any) {
    let data: any;
    let Token = this.helper.GenerateToken();
    return new Promise((resolve, reject) => {
      this.database.database
        .ref("users/")
        .orderByChild("UserName")
        .equalTo(Username)
        .limitToFirst(1)
        .once("value", function (snapshot) {
          let A = snapshot.val();
          if (snapshot.val()) {
            let key: any = Object.keys(A)[0];
            let Data = A[Object.keys(A).toString()];
            if (Data.UserName == Username) {
              return resolve(true);
            } else {
              return resolve(false);
            }
          } else if (A == null) {
            return resolve(false);
          }
        });
    });
  }

  isSocialUsernameRegistered(Username: any) {
    let data: any;
    let Token = this.helper.GenerateToken();
    return new Promise((resolve, reject) => {
      this.database.database
        .ref("users/")
        .orderByChild("SocialUserName")
        .equalTo(Username)
        .limitToFirst(1)
        .once("value", function (snapshot) {
          let A = snapshot.val();
          if (snapshot.val()) {
            let key: any = Object.keys(A)[0];
            let Data = A[Object.keys(A).toString()];
            if (Data.SocialUserName === Username) {
              return resolve(true);
            } else {
              return resolve(false);
            }
          } else if (A == null) {
            return resolve(false);
          }
        });
    });
  }

  // Create
  LikePost(like: PostLike) {
    return new Promise((resolve, reject) => {
      let Result;
      this.local.get("AuthKey").then(
        (key) => {
          if (key != undefined) {
            this.postList = this.database.list("/postlike");
            let CurrentDateTime = this.helper.formateDatePK();

            Result = this.postList.push({
              isLike: like.isLike,
              postID: like.postID,
              userID: like.userID,
              CreatedOn: CurrentDateTime,
            });
            return resolve(Result);
          }
        },
        (error) => {
          return reject(error);
        }
      );
    });
  }
  getLikePostList() {
    this.postList = this.database.list("/postlike");
    return this.postList;
  }

  LoginActivity(Obj, CorrectWrong) {
    return new Promise((resolve, reject) => {
      let Result;
      this.postList = this.database.list("/loginlogging");
      let CurrentDateTime = this.helper.formateDatePK();
      Result = this.postList.push({
        Email: Obj.Email,
        Password: Obj.Password,
        Device: {
          Platform: this.device.platform,
          Serial: this.device.serial,
          Model: this.device.model,
          Cordova: this.device.cordova,
          isVirtual: this.device.isVirtual,
          Manufacturer: this.device.manufacturer,
          UUID: this.device.uuid,
          Version: this.device.version,
        },
        SucceffullyLogin: CorrectWrong,
        LoginDateTime: CurrentDateTime,
      });
      return resolve(Result);
    });
  }

  // Create
  createProposal(proposal: Porposal) {
    return new Promise((resolve, reject) => {
      let Result;
      this.proposalList = this.database.list("/proposals");
      // let CurrentDateTime = this.helper.format;
      this.proposalList
        .push({
          Description: proposal.Description,
          Price: proposal.Price,
          Order_Delever_DateTime: proposal.Order_Delever_DateTime,
          Order_Delever_Days: proposal.Order_Delever_Days,
          Porposal_on_Post: proposal.Porposal_on_Post,
          Porposal_Sent_By: proposal.Porposal_Sent_By,
          Post_Created_By: proposal.Post_Created_By,
          Status: proposal.Status,
          isActive: proposal.isActive,
          CreatedDateTime: proposal.CreatedDateTime,
          ModifiedOn: proposal.ModifiedOn,
        })
        .get()
        .then((Result) => {
          let A = Result.key;
          return resolve(A);
        });
    });
  }

  GetTotalProposalCount(key: string) {
    return new Promise((resolve, reject) => {
      this.database.database
        .ref("/proposals")
        .orderByChild("Porposal_on_Post/key")
        .equalTo(key)
        .once("value", function (snapshot) {
          console.log(snapshot.val());
          if (snapshot.numChildren() > 0) {
            console.log(snapshot.numChildren());
            return resolve(snapshot.numChildren());
          } else {
            return resolve(false);
          }
        });
    });
  }

  SaveNotification(n: notifications) {
    return new Promise((resolve, reject) => {
      this.notificationList = this.database.list("/notifications");
      return this.notificationList
        .push({
          Title: n.Title,
          Message: n.Message,
          InfluencerID: n.InfluencerID,
          InfluencerName: n.InfluencerName,
          PostID: n.PostID,
          ProposalID: n.ProposalID,
          OrderID: n.OrderID,
          BizmanID: n.BizmanID,
          BizmanName: n.BizmanName,
          Status: n.Status,
          Type: n.Type,
          isSeen: n.isSeen,
          UserType: n.UserType,
          isDismiss: n.isDismiss,
          isActive: n.isActive,
          CreatedDateTime: n.CreatedDateTime,
          ModifiedOn: n.ModifiedOn,
          SeenDateTime: n.SeenDateTime,
          WalletID:n.WalletID
        })
        .then(() => {
          return resolve(true);
        })
        .catch(() => {
          return resolve(false);
        });
    });
  }

  getInflauncerNotification() {
    return new Promise((resolve, reject) => {
      this.database.database
        .ref("notifications/")
        .orderByChild("UserType")
        .equalTo("2")
        .on(
          "value",
          function (snapshot) {
            if (snapshot.val()) {
              let TempArr = [];
              snapshot.forEach((result) => {
                TempArr.push(result.val());
              });
              return resolve(TempArr);
            } else {
              return resolve(false);
            }
          },
          (error) => {
            return reject(error);
          }
        );
    });
  }

  getBizmanNotification() {
    return new Promise((resolve, reject) => {
      this.database.database
        .ref("notifications/")
        .orderByChild("UserType")
        .equalTo("1")
        .on(
          "value",
          function (snapshot) {
            if (snapshot.val()) {
              let TempArr = [];
              snapshot.forEach((result) => {
                TempArr.push(result.val());
              });
              return resolve(TempArr);
            } else {
              return resolve(false);
            }
          },
          (error) => {
            return reject(error);
          }
        );
    });
  }

  GetNotificationCount_Old() {
    return new Promise((resolve, reject) => {
      this.local.get("userData").then((result) => {
        let UserType = result.UserType == 2 ? "InfluencerID" : "BizmanID";
        this.database.database
          .ref("/notifications")
          .orderByChild(UserType)
          .equalTo(result.$key)
          .once("value", function (snapshot) {
            console.log(snapshot.val());
            if (snapshot.numChildren() > 0 && snapshot.numChildren() != null) {
              console.log(snapshot.numChildren());
              return resolve(snapshot.numChildren());
            } else {
              return resolve(false);
            }
          });
      });
    });
  }

  GetNotificationCount() {
    return new Promise((resolve, reject) => {
      this.local.get("userData").then((result) => {
        let UserType = result.UserType == 2 ? "InfluencerID" : "BizmanID";
        let nList = this.database.list("/notifications");
        nList.snapshotChanges().subscribe((res) => {
          let TempArr = [];
          let FilterArr = [];
          res.forEach((item) => {
            let a = item.payload.toJSON();
            a["key"] = item.key;
            TempArr.push(a);
          });
          if (TempArr.length > 0) {
            if (result.UserType == 1) {
              FilterArr = TempArr.filter(
                (x) =>
                  x.BizmanID == result.$key &&
                  x.UserType == 1 &&
                  x.isDismiss == false &&
                  x.isSeen == false
              );
            } else {
              FilterArr = TempArr.filter(
                (x) =>
                  x.InfluencerID == result.$key &&
                  x.UserType == 2 &&
                  x.isDismiss == false &&
                  x.isSeen == false
              );
            }
            return resolve(FilterArr.length);
          } else {
            return resolve(false);
          }
        });
      });
    });
  }

  getProposalByIds(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let propsal = this.database
        .object("/proposals/" + id)
        .valueChanges()
        .subscribe((propsal) => {
          return resolve(propsal);
        });
    });
  }

  getPostByIds(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let post = this.database
        .object("/posts/" + id)
        .valueChanges()
        .subscribe((post) => {
          return resolve(post);
        });
    });
  }

  NCount = 0;
  NotifBadge() {
    this.GetNotificationCount().then((data: any) => {
      if (data) {
        this.NCount = data;
      } else if (!data) {
        this.NCount = 0;
      }
    });
  }

  isProposalSeen(key: string) {
    return new Promise((resolve, reject) => {
      this.database.database
        .ref("/notifications")
        .orderByChild("ProposalID")
        .equalTo(key)
        .once("value", function (snapshot) {
          let A = snapshot.val();
          if (snapshot.val()) {
            let key: any = Object.keys(A)[0];
            let Data = A[Object.keys(A).toString()];
            if (Data != undefined) {
              return resolve(Data);
            } else {
              return resolve(null);
            }
          } else if (A == null) {
            return resolve(null);
          }
        });
    });
  }

  sendMsg(id: string, msg: string, type: string) {
    // let key = this.generateRandomString(16);
  }

  GenerateOrderNo() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 8; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  isProposalExist(key: string) {
    return new Promise((resolve, reject) => {
      let propsal = this.database
        .object("/proposals/" + key)
        .valueChanges()
        .subscribe((propsal: any) => {
          if (propsal) {
            return resolve(true);
          } else {
            return resolve(null);
          }
        });
    });
    // return new Promise((resolve, reject) => {
    //   this.database.database
    //     .ref("/proposals")
    //     .equalTo(key)
    //     .once("value", function (snapshot) {
    //       let A = snapshot.val();
    //       if (snapshot.val()) {
    //         let key: any = Object.keys(A)[0];
    //         let Data = A[Object.keys(A).toString()];
    //         if (Data !=undefined) {
    //           return resolve(true);
    //         } else {
    //           return resolve(null);
    //         }
    //       } else if (A == null) {
    //         return resolve(null);
    //       }
    //     });
    // });
  }

  GenerateOrder(order: order) {
    return new Promise((resolve, reject) => {
      let orders = this.database.list("/orders");
      return orders
        .push({
          OrderNo: order.OrderNo,
          Price: order.Price,
          DeleveryDate: order.DeleveryDate,
          Title: order.Title,
          RemainingDateTime: order.RemainingDateTime,
          InfluencerID: order.InfluencerID,
          InfluencerName: order.InfluencerName,
          PostID: order.PostID,
          ProposalID: order.ProposalID,
          BizmanID: order.BizmanID,
          BizmanName: order.BizmanName,
          ProgressPercentage: order.ProgressPercentage,
          Comments: order.Comments,
          Status: order.Status,
          isDeleted: order.isDeleted,
          isActive: order.isActive,
          OrderCreatedDateTime: order.OrderCreatedDateTime,
          ModifiedOn: order.ModifiedOn,
          DeleverInDays: order.DeleverInDays,
          isReviewed: order.isReviewed,
          WaitingForReview: order.WaitingForReview,
          isSubmited: order.isSubmited,
        })
        .get()
        .then((Result) => {
          let A = Result.key;
          return resolve(A);
        });
    });
  }

  UpdateProposal(id: string, Status?): Promise<any> {
    return new Promise((resolve, reject) => {
      let obj = {
        Status: Status,
        ModifiedOn: this.helper.formateDatePK(),
      };
      this.database
        .list("/proposals")
        .update(id, obj)
        .then((data) => {
          console.log("Update Proposal Data : " + data);
        });
    });
  }

  UpdateNotification(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let obj = {
        isSeen: true,
        ModifiedOn: this.helper.formateDatePK(),
      };
      this.database
        .list("/notifications")
        .update(id, obj)
        .then((data) => {
          console.log("Update Notification Data : " + data);
        });
    });
  }

  getOrderByIds(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.database
        .object("/orders/" + id)
        .valueChanges()
        .subscribe((order) => {
          return resolve(order);
        });
    });
  }

  getOrderList() {
    let order = this.database.list("/orders");
    return order;
  }

  updateOrderDays(id: string, RemainingDateTime): Promise<any> {
    if (RemainingDateTime != undefined) {
      return new Promise((resolve, reject) => {
        let object = {
          RemainingDateTime: RemainingDateTime,
          ModifiedOn: this.helper.formateDatePK(),
        };
        this.database.list("/orders").update(id, object);
      });
    }
  }

  getOrderByID(id: string) {
    let order = this.database.object("/orders/" + id);
    return order;
  }

  updateOrderStatus(id: string, obj): Promise<any> {
    if (obj != undefined) {
      return new Promise((resolve, reject) => {
        let object = {
          Comments: obj.Comments,
          ModifiedOn: obj.ModifiedOn,
          ProgressPercentage: obj.ProgressPercentage,
        };
        this.database
          .list("/orders")
          .update(id, object)
          .then(() => {
            return resolve(true);
          })
          .catch((error) => {
            return reject(error);
          });
      });
    }
  }

  CreateRoom(rooms: Rooms) {
    return new Promise((resolve, reject) => {
      let chat = this.database.list("/rooms");
      return chat
        .push({
          BizmanID: rooms.BizmanID,
          BizmanName: rooms.BizmanName,
          InfluencerID: rooms.InfluencerID,
          InfluencerName: rooms.InfluencerName,
          chat: rooms.chat,
          CreatedDateTime: rooms.CreatedDateTime,
          ModefiedDateTime: rooms.ModefiedDateTime,
          isActive: rooms.isActive,
        })
        .get()
        .then((Result) => {
          let A = Result.key;
          return resolve(A);
        });
    });
  }

  isRoomExist(key) {
    return new Promise((resolve, reject) => {
      this.local.get("userData").then((d) => {
        let InfBizman = d.UserType == "1" ? "BizmanID" : "InfluencerID";
        this.database.database
          .ref("rooms/")
          .orderByChild(InfBizman)
          .equalTo(key)
          .once("value", function (snapshot) {
            let A = snapshot.val();
            if (snapshot.val()) {
              let key: any = Object.keys(A)[0];
              let Data = A[Object.keys(A).toString()];
              if (d.UserType == "1") {
                if (Data != undefined && Data.BizmanID == d.$key) {
                  return resolve(key);
                } else {
                  return resolve(false);
                }
              } else if (d.UserType == "2") {
                if (Data != undefined && Data.InfluencerID == d.$key) {
                  return resolve(key);
                } else {
                  return resolve(false);
                }
              }
            } else {
              return resolve(false);
            }
          });
      });
    });
  }

  // Get List
  getRoomList() {
    let rooms = this.database.list("/rooms");
    return rooms;
  }

  // Get Single
  getRoomByID(id: string) {
    let room = this.database.object("/rooms/" + id);
    return room;
  }

  SendMessage(id: string, obj): Promise<any> {
    if (obj != undefined) {
      return new Promise((resolve, reject) => {
        let object = {
          chat: obj.chat,
          ModefiedDateTime: obj.ModefiedDateTime,
        };
        this.database
          .list("/rooms")
          .update(id, object)
          .then(() => {
            return resolve(true);
          })
          .catch((error) => {
            return reject(error);
          });
      });
    }
  }

  GetTotalInfluencer() {
    return new Promise((resolve, reject) => {
      this.database.database
        .ref("/users")
        .orderByChild("UserType")
        .equalTo("2")
        .once("value", function (snapshot) {
          console.log(snapshot.val());
          if (snapshot.numChildren() > 0) {
            console.log(snapshot.numChildren());
            return resolve(snapshot.numChildren());
          } else {
            return resolve(false);
          }
        });
    });
  }

  GetTotalPropodal() {
    return new Promise((resolve, reject) => {
      this.database.database
        .ref("/proposals")
        .orderByChild("Post_Created_By/key")
        .equalTo(this.helper.userData.$key)
        .once("value", function (snapshot) {
          console.log(snapshot.val());
          if (snapshot.numChildren() > 0) {
            console.log(snapshot.numChildren());
            return resolve(snapshot.numChildren());
          } else {
            return resolve(false);
          }
        });
    });
  }

  AddCard(Cardobj) {
    let card = this.database.list("/cards");
    return card.push({
      CardHolderName: Cardobj.CardHolderName,
      CardNo: Cardobj.CardNo,
      ExpiryMonth: Cardobj.ExpiryMonth,
      ExpiryYear: Cardobj.ExpiryYear,
      BizmanID: Cardobj.BizmanID,
      CreatedOn: Cardobj.CreatedOn,
      ModifiedOn: Cardobj.ModifiedOn,
      isActive: Cardobj.isActive,
      isExpire: Cardobj.isExpire,
      AccountBalance: Cardobj.AccountBalance,
    });
  }
  // Get List
  getCardList() {
    this.CardList = this.database.list("/cards");
    return this.CardList;
  }

  // Get Single
  getCardByID(id: string) {
    let card = this.database.object("/cards/" + id);
    return card;
  }

  deleteCard(id: string) {
    let a = this.database.object("/cards/" + id);
    a.remove();
  }
  deleteOrder(id: string) {
    let a = this.database.object("/orders/" + id);
    a.remove();
  }

  SaveCreateOrderTrasaction(t: Transactions) {
    return new Promise((resolve, reject) => {
      let list = this.database.list("/transactions");
      return list
        .push({
          AdminTax: t.AdminTax,
          AdminID: t.AdminID,
          BizmanID: t.BizmanID,
          CreatedDateTime: t.CreatedDateTime,
          CreditCardID: t.CreditCardID,
          DeleverToAdmin: t.DeleverToAdmin,
          DeleverToInfluencer: t.DeleverToInfluencer,
          PaymentType: t.PaymentType,
          InfluencerID: t.InfluencerID,
          ModifiedOn: t.ModifiedOn,
          ReturnToBizman: t.ReturnToBizman,
          OrderAmount: t.OrderAmount,
          FinalAmount: t.FinalAmount,
          TransactionType: t.TransactionType,
          isActive: t.isActive,
          OrderId: t.OrderId,
          InfluencerName: t.InfluencerName,
          BizmanName: t.BizmanName,
        })
        .then(() => {
          return resolve(true);
        })
        .catch(() => {
          return resolve(false);
        });
    });
  }

  getAdminID() {
    return new Promise((resolve, reject) => {
      this.database.database
        .ref("users/")
        .orderByChild("UserType")
        .equalTo("3")
        .limitToFirst(1)
        .on("value", function (snapshot) {
          let A = snapshot.val();
          if (snapshot.val()) {
            let key: any = Object.keys(A)[0];
            if (key) {
              return resolve(key);
            } else {
              return resolve(null);
            }
          } else if (A == null) {
            return resolve(null);
          }
        });
    });
  }

  get_AdminID() {
    let d;
    this.getAdminID().then((data) => {
      if (data) {
        d = data;
        alert(data);
      }
    });
    return d;
  }

  UpdateCardAmount(id: string, obj): Promise<any> {
    if (obj != undefined) {
      return new Promise((resolve, reject) => {
        let object = {
          AccountBalance: obj.AccountBalance,
          ModifiedOn: obj.ModifiedOn,
        };
        this.database
          .list("/cards")
          .update(id, object)
          .then(() => {
            return resolve(true);
          })
          .catch((error) => {
            return reject(error);
          });
      });
    }
  }

  UpdateOrderSubmit(id: string, obj): Promise<any> {
    if (obj != undefined) {
      return new Promise((resolve, reject) => {
        let object = {
          isSubmited: obj.isSubmited,
          ModifiedOn: obj.ModifiedOn,
          WaitingForReview: obj.WaitingForReview,
          isReviewed: obj.isReviewed,
          Status: obj.Status,
        };
        this.database
          .list("/orders")
          .update(id, object)
          .then(() => {
            return resolve(true);
          })
          .catch((error) => {
            return reject(error);
          });
      });
    }
  }

  SubmitReview(i: influencerReviews) {
    return new Promise((resolve, reject) => {
      let list = this.database.list("/influencerReviews");
      return list
        .push({
          Review: i.Review,
          Rating: i.Rating,
          OrderID: i.OrderID,
          ReviewsTo: i.ReviewsTo,
          ReviewToName: i.ReviewToName,
          ReviewFromID: i.ReviewFromID,
          ReviewFromName: i.ReviewFromName,
          ReviewStatus: i.ReviewStatus,
          Status: i.Status,
          isDeleted: i.isDeleted,
          isActive: i.isActive,
          CreatedDateTime: i.CreatedDateTime,
          ModifiedOn: i.ModifiedOn,
        })
        .then(() => {
          return resolve(true);
        })
        .catch(() => {
          return resolve(false);
        });
    });
  }

  UpdateOrderFinalStatus(id: string, obj): Promise<any> {
    if (obj != undefined) {
      return new Promise((resolve, reject) => {
        let object = {
          isSubmited: obj.isSubmited,
          ModifiedOn: obj.ModifiedOn,
          WaitingForReview: obj.WaitingForReview,
          isReviewed: obj.isReviewed,
          Status: obj.Status,
          RemainingDateTime: obj.RemainingDateTime,
        };
        this.database
          .list("/orders")
          .update(id, object)
          .then(() => {
            return resolve(true);
          })
          .catch((error) => {
            return reject(error);
          });
      });
    }
  }

  UpdateInfluencerOrderRating(id: string, obj): Promise<any> {
    if (obj != undefined) {
      return new Promise((resolve, reject) => {
        let object = {
          TotalStars: obj.TotalStars,
          Rating: obj.Rating,
          OrderCount: obj.OrderCount,
          ModifiedOn: obj.ModifiedOn,
        };
        this.database
          .list("/users")
          .update(id, object)
          .then(() => {
            return resolve(true);
          })
          .catch((error) => {
            return reject(error);
          });
      });
    }
  }

  geInfluencerOrderReview(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.database.database
        .ref("/influencerReviews")
        .orderByChild("OrderID")
        .equalTo(id)
        .once("value", function (snapshot) {
          let A = snapshot.val();
          if (snapshot.val()) {
            let key: any = Object.keys(A)[0];
            let Data = A[Object.keys(A).toString()];
            if (Data != undefined) {
              return resolve(key);
            } else {
              return resolve(null);
            }
          } else if (A == null) {
            return resolve(null);
          }
        });
    });
  }

  getReview(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.database
        .object("/influencerReviews/" + id)
        .valueChanges()
        .subscribe((order) => {
          return resolve(order);
        });
    });
  }

  getTransactionList() {
    let t = this.database.list("/transactions");
    return t;
  }

  getUser(id: string) {
    this.getUserByIds(id).then((data) => {
      if (data) {
        return data;
      }
    });
  }

  UpdateTransaction(id: string, obj): Promise<any> {
    if (obj != undefined) {
      return new Promise((resolve, reject) => {
        let object = {
          DeleverToInfluencer: obj.DeleverToInfluencer,
          ModifiedOn: obj.ModifiedOn,
        };
        this.database
          .list("/transactions")
          .update(id, object)
          .then(() => {
            return resolve(true);
          })
          .catch((error) => {
            return reject(error);
          });
      });
    }
  }

  ApprovePost(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let object = {
        Status: "C",
        ModefiedDateTime: this.helper.formateDatePK(),
      };
      this.database
        .list("/posts")
        .update(id, object)
        .then(() => {
          return resolve(true);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  RejectPost(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let object = {
        Status: "R",
        ModefiedDateTime: this.helper.formateDatePK(),
      };
      this.database
        .list("/posts")
        .update(id, object)
        .then(() => {
          return resolve(true);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  deleteConversation(id: string) {
    this.postRef = this.database.object("/rooms/" + id);
    this.postRef.remove();
  }

  FCM(fcm) {
    return new Promise((resolve, reject) => {
      let nList = this.database.list("/users");
      nList.snapshotChanges().subscribe((res) => {
        let TempArr = [];
        let FilterArr = [];
        res.forEach((item) => {
          let a = item.payload.toJSON();
          a["key"] = item.key;
          TempArr.push({ fcmToken: a["fcmToken"], key: a["key"] });
        });
        if (TempArr.length > 0) {
          TempArr = TempArr.filter((x) => x.fcmToken === fcm);
          return resolve(TempArr);
        } else {
          return resolve(false);
        }
      });
    });
  }

  isFCM(fcm) {
    return new Promise((resolve, reject) => {
      this.FCM(fcm).then((data: any) => {
        if (data.length > 0) {
          return resolve(data);
        } else {
          return resolve(false);
        }
      });
    });
  }

  updateToken(id: string, fcm): Promise<any> {
    return new Promise((resolve, reject) => {
      let object = {
        fcmToken: fcm,
        ModifiedOn: this.helper.formateDatePK(),
      };
      this.database
        .list("/users")
        .update(id, object)
        .then(() => {
          return resolve(true);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  getToken(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.database
        .object("/users/" + id)
        .valueChanges()
        .subscribe((token: any) => {
          return resolve(token.fcmToken);
        });
    });
  }

  AddtoWallet(wallet: eWallet) {
    return new Promise((resolve, reject) => {
      let list = this.database.list("/wallet");
      return list
        .push({
          Balance: wallet.Balance,
          CreatedOn: wallet.CreatedOn,
          ModifiedOn: wallet.ModifiedOn,
          Status: wallet.Status,
          isActive: wallet.isActive,
          isBlock: wallet.isBlock,
          userID: wallet.userID,
        })
        .get()
        .then((Result) => {
          let A = Result.key;
          return resolve(A);
        });
    });
  }

  isWalletExist(userID: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.database.database
        .ref("/wallet")
        .orderByChild("userID")
        .equalTo(userID)
        .once("value", function (snapshot) {
          let A = snapshot.val();
          if (snapshot.val()) {
            let key: any = Object.keys(A)[0];
            let Data = A[Object.keys(A).toString()];
            if (Data != undefined) {
              let obj={key:key,Balance:Data.Balance}
              return resolve(obj);
            } else {
              return resolve(null);
            }
          } else if (A == null) {
            return resolve(null);
          }
        });
    });
  }

  updateWallet(id: string,obj): Promise<any> {
    return new Promise((resolve, reject) => {
      let object = {
        Balance: obj.Balance,
        ModifiedOn:obj.ModifiedOn,
      };
      this.database
        .list("/wallet")
        .update(id, object)
        .then(() => {
          return resolve(true);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  BlockUser(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let object = {
        IsActive: "0",
        ModifiedOn: this.helper.formateDatePK(),
      };
      this.database
        .list("/users")
        .update(id, object)
        .then(() => {
          return resolve(true);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
  
  UnBlockUser(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let object = {
        IsActive: "1",
        ModifiedOn: this.helper.formateDatePK(),
      };
      this.database
        .list("/users")
        .update(id, object)
        .then(() => {
          return resolve(true);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  deleteUser(id: string) {
    let a = this.database.object("/users/" + id);
    a.remove();
  }


  ProposalStatusUpdate(id: string,type): Promise<any> {
    return new Promise((resolve, reject) => {
      let active=type===0?false:true;
      let object = {
        isActive: active,
        ModifiedOn: this.helper.formateDatePK(),
      };
      this.database
        .list("/proposals")
        .update(id, object)
        .then(() => {
          return resolve(true);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  TotalProposal(){
    return new Promise((resolve,reject)=>{
      let tempArr=[]
      let p = this.getProposalList();
      p.snapshotChanges().subscribe(res => {
        res.forEach(item => {
          let a = item.payload.toJSON();   
          tempArr.push(a as Porposal);
       
          })
          return resolve(tempArr.length);
      
        })
    })

  }

  TotalUser(){
    return new Promise((resolve,reject)=>{
      let tempArr=[]
      let p = this.getInflauncerList();
      p.snapshotChanges().subscribe(res => {
        res.forEach(item => {
          let a = item.payload.toJSON();   
          tempArr.push(a as UsersRegistration);
         
          })
          return resolve(tempArr.length);
      
        })
    })

  }

  TotalPosts(){
    return new Promise((resolve,reject)=>{
      let tempArr=[]
      let p = this.getPostList();
      p.snapshotChanges().subscribe(res => {
        res.forEach(item => {
          let a = item.payload.toJSON();   
          tempArr.push(a as Posts);
         
          })
          return resolve(tempArr.length);
      
        })
    })

  }

  TotalOrders(){
    return new Promise((resolve,reject)=>{
      let tempArr=[]
      let p = this.getOrderList();
      p.snapshotChanges().subscribe(res => {
        res.forEach(item => {
          let a = item.payload.toJSON();   
          tempArr.push(a as order);
         
          })
          return resolve(tempArr.length);
      
        })
    })

  }

  TranctionTotal(){
    return new Promise((resolve,reject)=>{
      let tempArr=[]
      let p = this.getTransactionList();
      p.snapshotChanges().subscribe(res => {
        res.forEach(item => {
          let a = item.payload.toJSON();   
          tempArr.push(a as Transactions);
         
          })
          return resolve(tempArr.length);
      
        })
    })

  }

  
  InActiveActiveOrder(id: string,status): Promise<any> {
    return new Promise((resolve, reject) => {
      let s=status===1?true:false
      let object = {
        isActive: s,
        ModifiedOn: this.helper.formateDatePK(),
      };
      this.database
        .list("/orders")
        .update(id, object)
        .then(() => {
          return resolve(true);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }


  


  



}
