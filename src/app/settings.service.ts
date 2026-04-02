import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
 


  constructor(private userservice : UserService) { }

  

  getuserlist(){
    return this.userservice.getregisteredUser();
  }

  removeuser(email: string) {
    let user = this.userservice.getregisteredUser();
    user = user.filter((u: any) => u.email !== email);
    localStorage.setItem("registeredUsers", JSON.stringify(user));

}

getTotalUsers() {
  const users = this.userservice.getregisteredUser();
  return users.length;
}
}
