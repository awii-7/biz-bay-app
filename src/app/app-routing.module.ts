import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TabsPage } from './pages/tabs/tabs.page';
import { AuthGuardService } from './services/Security/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'intro', pathMatch: 'full' },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then(m => m.IntroPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule),
    // canActivate: [AuthGuardService]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule),
    // canActivate: [AuthGuardService]

  },
  {
    path: 'view-profile',
    loadChildren: () => import('./pages/view-profile/view-profile.module').then(m => m.ViewProfilePageModule),
    // canActivate: [AuthGuardService]


  },

  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'verifyEmail',
    loadChildren: () => import('./pages/verify-account/verify-account.module').then(m => m.VerifyAccountPageModule),
    // canActivate: [AuthGuardService]

  },
  {
    path: 'home',
    loadChildren: () => import('./pages/bizdash/bizdash.module').then(m => m.BizdashPageModule),
    // canActivate: [AuthGuardService]

  },
  {
    path: 'home2',
    loadChildren: () => import('./pages/inflancer-dash/inflancer-dash.module').then(m => m.InflancerDashPageModule),
    // canActivate: [AuthGuardService]

  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    // canActivate: [AuthGuardService]

  },
  {
    path: 'chat/:roomid',
    loadChildren: () => import('./pages/chat/chat/chat.module').then(m => m.ChatPageModule),
    // canActivate: [AuthGuardService]

  },

  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'bizdash',
    loadChildren: () => import('./pages/bizdash/bizdash.module').then(m => m.BizdashPageModule),
    // canActivate: [AuthGuardService]


      },
      {
      path: 'inflancerdash',
      loadChildren: () => import('./pages/inflancer-dash/inflancer-dash.module').then(m => m.InflancerDashPageModule),
    // canActivate: [AuthGuardService]

        },
      {
        path: 'maintainpost',
        loadChildren: () => import('./pages/posts/maintain-posts/maintain-posts.module').then(m => m.MaintainPostsPageModule),
    // canActivate: [AuthGuardService]

      },
      {
        path: 'intro1',
        loadChildren: () => import('./pages/intro/intro.module').then(m => m.IntroPageModule)
      },
      {
        path: 'notification',
           loadChildren: () => import('./pages/notification/notification.module').then( m => m.NotificationPageModule),
    // canActivate: [AuthGuardService]

      },
      {
        path: 'profile2',
        loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    // canActivate: [AuthGuardService]

      },
      {
        path: 'myposts',
        loadChildren: () => import('./pages/posts/myposts/myposts.module').then( m => m.MypostsPageModule),
    // canActivate: [AuthGuardService]

      },
      {
        path: 'postlist',
        loadChildren: () => import('./pages/posts/posts-list/posts-list.module').then(m => m.PostsListPageModule),
    // canActivate: [AuthGuardService]

      },
      {
        path: 'postdetail/:postid',
        loadChildren: () => import('./pages/posts/post-detail/post-detail.module').then(m => m.PostDetailPageModule),
    // canActivate: [AuthGuardService]

      },
      {
        path: 'userdetail/:userid',
        loadChildren: () => import('./pages/user-detail/user-detail.module').then( m => m.UserDetailPageModule),
    // canActivate: [AuthGuardService]

      },
      {
        path: 'myproposal',
        loadChildren: () => import('./pages/proposal/myproposal/myproposal.module').then( m => m.MyproposalPageModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./pages/orders/orders/orders.module').then( m => m.OrdersPageModule)
      },
      {
        path: 'recived-proposals',
        loadChildren: () => import('./pages/proposal/recived-proposals/recived-proposals.module').then( m => m.RecivedProposalsPageModule)
      },
      {
        path: 'trackorder/:orderid',
        loadChildren: () => import('./pages/orders/track-order/track-order.module').then( m => m.TrackOrderPageModule)
      },
      {
        path: 'influencerlist',
        loadChildren: () => import('./pages/users/influencer-list/influencer-list.module').then( m => m.InfluencerListPageModule)
      },
      {
        path: 'messagelist',
        loadChildren: () => import('./pages/chat/messagelist/messagelist.module').then( m => m.MessagelistPageModule)
      },
      {
        path: 'admindash',
        loadChildren: () => import('./pages/admin/admin-dash/admin-dash.module').then( m => m.AdminDashPageModule)
      },
      {
        path: 'userslist',
        loadChildren: () => import('./pages/admin/users-list/users-list.module').then( m => m.UsersListPageModule)
      },
      {
        path: 'payorder',
        loadChildren: () => import('./pages/Payments/pay-order/pay-order.module').then( m => m.PayOrderPageModule)
      },
      {
        path: 'influencer_payments',
        loadChildren: () => import('./pages/admin/users-payments/users-payments.module').then( m => m.UsersPaymentsPageModule)
      },
      {
        path: 'posts-list',
        loadChildren: () => import('./pages/admin/posts-list/posts-list.module').then( m => m.PostsListPageModule)
      },
      {
        path: 'proposals',
        loadChildren: () => import('./pages/admin/proposals/proposals.module').then( m => m.ProposalsPageModule)
      },
      {
        path: 'e-wallet',
        loadChildren: () => import('./pages/Payments/e-wallet/e-wallet.module').then( m => m.EWalletPageModule)
      },
      {
        path: 'orders-lists',
        loadChildren: () => import('./pages/admin/orders-lists/orders-lists.module').then( m => m.OrdersListsPageModule)
      },


    
    ]
  },
  {
    
      path: 'createpost',
      loadChildren: () => import('./pages/posts/maintain-posts/maintain-posts.module').then(m => m.MaintainPostsPageModule),
    // canActivate: [AuthGuardService]

  }
  ,
  {
    path: 'feedback',
    loadChildren: () => import('./pages/feedback/feedback.module').then(m => m.FeedbackPageModule),
    // canActivate: [AuthGuardService]

  },
  {
    path: 'maintainpost',
    loadChildren: () => import('./pages/posts/maintain-posts/maintain-posts.module').then(m => m.MaintainPostsPageModule),
    // canActivate: [AuthGuardService]

  },
  {
    path: 'postlist',
    loadChildren: () => import('./pages/posts/posts-list/posts-list.module').then(m => m.PostsListPageModule),
    // canActivate: [AuthGuardService]

  },

  {
    path: 'notification2',
    loadChildren: () => import('./pages/notification/notification.module').then( m => m.NotificationPageModule),
    // canActivate: [AuthGuardService]

  },
  {
    path: 'userdetail/:userid',
    loadChildren: () => import('./pages/user-detail/user-detail.module').then( m => m.UserDetailPageModule),
// canActivate: [AuthGuardService]

  },

  {
    path: 'proposal-detail',
    loadChildren: () => import('./pages/proposal/proposal-detail/proposal-detail.module').then( m => m.ProposalDetailPageModule)
  },
  {
    path: 'revieworder',
    loadChildren: () => import('./pages/orders/review-order/review-order.module').then( m => m.ReviewOrderPageModule)
  },
































];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
