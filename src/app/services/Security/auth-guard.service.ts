import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private authenticationService:ApiService
  ) {
    
   }

  canActivate(): boolean {
    return this.authenticationService.isAuthenticated();
  }
}
