import { Component, OnInit } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  constructor(
    public sendEmail:EmailComposer
  ) { }

  ngOnInit() {
  }

  SendFeedback(Name,Email,Subject,Message){
    let email = {
      to: 'bizbaycustomercare@gmail.com',
      cc: Email,
      //bcc: ['john@doe.com', 'jane@doe.com'],
      subject: Subject==""?"Customer Feedback":Subject,
      body: Name +"<br>"+ Message,
      isHtml: true
    }
  // Send a text message using default options
    this.sendEmail.open(email);
  } 

}
