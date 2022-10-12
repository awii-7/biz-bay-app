import { Injectable } from '@angular/core';
import { ApiHelperService } from './api-helper.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    public Apihelper:ApiHelperService
  ) { }

  MessageNotification(data):Promise<any>{
    let link="?title="+data.title+"&token="+data.token+"&body="+data.body+"&page="+data.page+"&id="+data.id;
      return new Promise((resolve, reject) => {
        this.Apihelper.get("https://bizbay.000webhostapp.com/fcmNotification.php"+link).then((data) => {
          let d = data;
          if (d.success == 1) {
            console.log(" chat notification sent")
            return resolve(true);
          }
          else if (d.failure == 1) {
            console.log(" chat notification not sent")
            return resolve(false);
  
          }
        },(error)=>{
          return resolve(false);
        })
      })
    }
}
