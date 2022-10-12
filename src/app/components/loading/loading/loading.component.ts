import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
Show:boolean=true;
  constructor() {
    setTimeout(()=>{
    this.Show=false;
    },2000)
   }

  ngOnInit() {}

}
