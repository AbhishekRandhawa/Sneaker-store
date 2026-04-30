import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent implements OnInit {
  allusers: any[] = [];

  constructor(private settingservice: SettingsService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.allusers = this.settingservice.getuserlist();
  }

  // --- Naya User Add Karne Ka Function ---
createUserByAdmin() {
  Swal.fire({
    title: '<h3 style="color: #fca311">Create New User</h3>',
    background: '#111827',
    html:
      `<input id="swal-name" class="swal2-input custom-input" placeholder="Full Name" style="color: white; border-color: #374151; background: #1f2937">` +
      `<input id="swal-email" class="swal2-input custom-input" placeholder="Email Address" style="color: white; border-color: #374151; background: #1f2937">` +
      `<input id="swal-password" type="password" class="swal2-input custom-input" placeholder="Password" style="color: white; border-color: #374151; background: #1f2937">` +
      `<input id="swal-city" class="swal2-input custom-input" placeholder="City (e.g. Kangra)" style="color: white; border-color: #374151; background: #1f2937">` +
      `<select id="swal-role" class="swal2-input custom-input" style="color: white; border-color: #374151; background: #1f2937">
        <option value="user" style="background: #1f2937">User</option>
        <option value="admin" style="background: #1f2937">Admin</option>
      </select>`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Create User',
    confirmButtonColor: '#fca311',
    cancelButtonColor: '#4b5563',
    preConfirm: () => {
      const name = (document.getElementById('swal-name') as HTMLInputElement).value;
      const email = (document.getElementById('swal-email') as HTMLInputElement).value;
      const password = (document.getElementById('swal-password') as HTMLInputElement).value;
      const city = (document.getElementById('swal-city') as HTMLInputElement).value;
      const role = (document.getElementById('swal-role') as HTMLSelectElement).value;

      if (!name || !email || !password || !city) {
        Swal.showValidationMessage('Bhai, location ke sath saari fields bharna zaroori hai!');
        return false;
      }
      return { name, email, password, city, role };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const newUser = {
        fullName: result.value.name, // Aapka HTML 'fullName' use kar raha hai
        email: result.value.email,
        password: result.value.password,
        role: result.value.role,
        city: result.value.city, // Nayi location field
        mobile: '', 
        gender: 'Not Specified',
        terms: true
      };

      const success = this.settingservice.addUserByAdmin(newUser);
      
      if (success) {
        Swal.fire({
          title: 'Created!',
          text: `User ${newUser.fullName} from ${newUser.city} added successfully.`,
          icon: 'success',
          background: '#111827',
          color: '#fff'
        });
        this.loadUsers();
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Yeh email pehle se register hai!',
          icon: 'error',
          background: '#111827',
          color: '#fff'
        });
      }
    }
  });
}

  // --- Delete User Function ---
  deleteuser(email: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete the user: ${email}`,
      icon: 'warning',
      background: '#111827',
      color: '#fff',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.settingservice.removeuser(email);
        this.loadUsers();
        Swal.fire({
          title: 'Deleted!',
          text: 'User has been removed.',
          icon: 'success',
          background: '#111827',
          color: '#fff'
        });
      }
    });
  }
}