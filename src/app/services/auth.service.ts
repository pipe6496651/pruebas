import { Injectable } from '@angular/core';

import { UserManager, UserManagerSettings, User } from 'oidc-client';

@Injectable({
  
  providedIn: 'root'
})
export class AuthService {

  private manager = new UserManager(getClientSettings());
  private user: User = null;

  constructor() {
    this.manager.getUser().then(user => {
      this.user = user;
    });
  }

  isLoggedIn(): boolean {
    return this.user != null && !this.user.expired;
  }

  getClaims(): any {
    return this.user.profile;
  }

  getAuthorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  startAuthentication(): Promise<void> {
    return this.manager.signinRedirect();
  }

  completeAuthentication(): Promise<void> {
    return this.manager.signinRedirectCallback().then(user => {
      this.user = user;
    });
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
    authority: 'https://drsgps.co/identity',
    client_id: "js",
    redirect_uri: 'https://drsgps.co/protectedapi/callback.html',
    post_logout_redirect_uri: '/home.html',
    response_type: "id_token token",
    scope: "openid profile api1",
    filterProtocolClaims: true,
    loadUserInfo: true
  };
}