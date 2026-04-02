import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CommonModule,RouterLink],
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

deleteuser(email: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete the user: ${email}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // Red color for delete
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Actual deletion logic
        this.settingservice.removeuser(email);
        this.loadUsers(); // Refresh list

        // Success message popup
        Swal.fire(
          'Deleted!',
          'User has been removed from Shoes Hub.',
          'success'
        );
      }
    });
  }
}
