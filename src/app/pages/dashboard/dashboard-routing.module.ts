import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';


// const routes: Routes = [
//   {
//     path: '',
//     component: DashboardPage
//   }
// ];

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPage,
    children:[
  
       // { path: 'leadListTab', loadChildren: '../tab2/tab2.module#Tab2PageModule' },

        { path: 'profiletTab', 
          loadChildren: () => import('../view-profile/view-profile.module').then( m => m.ViewProfilePageModule)
      },
    ]
  },
  // {
  //   path:'',
  //   redirectTo:'/dashboard/invListTab',
  //   pathMatch:'full',
  //   canActivate: [AuthGuardService]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
