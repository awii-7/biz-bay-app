import { Component, OnInit } from '@angular/core';
import { BizdashPage } from '../bizdash/bizdash.page';
import { ChatPage } from '../chat/chat/chat.page';
import { ProfilePage } from '../profile/profile.page';
import { NavService } from 'src/app/services/Navigation/nav.service';
import { NotificationPage } from '../notification/notification.page';
import { MaintainPostsPage } from '../posts/maintain-posts/maintain-posts.page';
import { HelperService } from 'src/app/services/HelperService/helper.service';
import { OrdersPage } from '../orders/orders/orders.page';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  

  tab1Root = BizdashPage ;
  // tab2Root = ChatPage;
  tab3Root = ProfilePage;
  tab4Root = NotificationPage
  tab5Root = MaintainPostsPage
  tab6Root=OrdersPage


  constructor(
    public nav:NavService,
    public helper:HelperService
  ) { }

  ngOnInit() {
  }

}
