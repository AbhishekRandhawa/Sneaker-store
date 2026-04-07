import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  iscolllaped = false;
  public authService = inject(AuthService);
  private router = inject(Router);





  toggleSidebar() {
    this.iscolllaped = !this.iscolllaped;
  }
  onLogout() {
    Swal.fire({
      title: 'Logging Out?',
      text: "Wapis aana jaldi! 👟",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#fbbf24',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.Logout();
        this.router.navigate(['/login']);
      }
    });
  }
}
