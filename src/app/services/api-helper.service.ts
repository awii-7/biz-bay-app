import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class ApiHelperService {

  constructor(public http:HttpClient,
    private https: HTTP
    ) { }

 

  Get(url): Promise<any> {
     debugger;
    return new Promise((resolve, error) => {
            let header=new HttpHeaders();
      header.append('Access-Control-Allow-Origin', '*');
      // header.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
      // header.set('Accept', 'application/json');
      // header.set('content-type', 'application/json');

    //   this.http.get(url,{headers:header}).subscribe((data:any) => {
    //     return resolve(data);
    //   }, (ServiceErr) => {
    //     return error(ServiceErr)
    //   });
    // });
    this.http.get(url,{headers:header}).subscribe((data: any) => {
      // this.RequestUrl = data.url
      // console.log("GET Request Url On Success :" + this.RequestUrl);
      return resolve(data);
    }, (ServiceErr) => {
      // console.log("GET Request Url On Error :" + this.RequestUrl);
      return error(ServiceErr)

    });
  });
  }

  get(url): Promise<any>{
    return new Promise((resolve, errors) => {
    this.https.get(url, {}, {})
  .then((data:any) => {
    let d =JSON.parse(data.data);

    console.log(data.status);
    console.log(data.data); // data received by server
    console.log(data.headers);
    return resolve(d);
  })
  .catch(error => {

    console.log(error.status);
    console.log(error.error); // error message as string
    console.log(error.headers);
    return errors(error);

  });
  })
}



  Post(URL, Data) {
    return new Promise((resolve, error) => {

      this.http.post(URL, Data).pipe(map((res: any) => res.json())).subscribe((data) => {

        // return resolve(data.d)
        return resolve(data)
      }
        , (Servererror) => {

          return error(Servererror);
        }
      )

    }
    )
  }
  PostNew(url,Data) {
    debugger;
    return new Promise((resolve, error) => {
      // let header=new HttpHeaders();
      // header.append( 'Access-Control-Allow-Origin', '*');
      // header.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
      // header.append('Accept', 'application/json');
      // header.append('content-type', 'application/json');
 
      this.http.post(url, Data).subscribe((data) => {
        
        return resolve(data)
      }
        , (Servererror) => {
          
          return error(Servererror);
        }
      )

    }
    )
  }

  Postfcm() {
    debugger;
    return new Promise((resolve, error) => {
      // let header=new HttpHeaders();
      // header.append( 'Access-Control-Allow-Origin', '*');
      // header.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
      // header.append('Accept', 'application/json');
      // header.append('content-type', 'application/json');
      let data:[
        "to" , 'DEVICE_TOKEN',
        "notification" , [
            "body" , "SOMETHING",
            "title" , "SOMETHING",
            "icon" , "ic_launcher"
        ],
        "data" , [
            "ANYTHING EXTRA HERE"
        ]
    ]
 
      this.http.post("https://bizbay.000webhostapp.com/fcm.php", data).subscribe((data) => {
        
        return resolve(data)
      }
        , (Servererror) => {
          
          return error(Servererror);
        }
      )

    }
    )
  }
}
