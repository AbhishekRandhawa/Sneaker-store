import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class SettingsService {

  constructor(private userservice: UserService) { }

  getuserlist() {
    return this.userservice.getregisteredUser();
  }

  removeuser(email: string) {
    let users = this.getuserlist();
    users = users.filter((u: any) => u.email !== email);
    localStorage.setItem("registeredUsers", JSON.stringify(users));
  }

  addUserByAdmin(newUser: any) {
    const users = this.getuserlist();
    const exists = users.find((u: any) => u.email === newUser.email);
    
    if (!exists) {
      users.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      return true;
    }
    return false;
  }
}