import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { addIcons } from 'ionicons';
import {
  chevronForwardOutline,
  notificationsOutline,
  ticketOutline,
  settingsOutline,
  helpCircleOutline,
} from 'ionicons/icons';
import { AuthService } from '../../../services/auth.service';

addIcons({
  chevronForwardOutline,
  notificationsOutline,
  ticketOutline,
  settingsOutline,
  helpCircleOutline,
});

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  user: any = null; // Store user details here
  isActive = false; // Sidebar active state
  isLoggedIn =false;
  apiUrl = 'http://localhost:5095/api/User/'; // Base URL for User API

  sidebarItems = [
    {
      icon: 'notifications-outline',
      text: 'Notifications',
      link: '#',
      disabled: false,
    },
    {
      icon: 'ticket-outline',
      text: 'Purchase History',
      subtext: 'View all your bookings & purchases',
      link: '#',
      disabled: this.isLoggedIn,
    },
    {
      icon: 'help-circle-outline',
      text: 'Help & Support',
      subtext: 'View commonly asked queries and chat',
      link: '/usersupport/dashboard',
      disabled: false,
    },
    {
      icon: 'settings-outline',
      text: 'Accounts & Settings',
      subtext: 'Location, payments, addresses & more',
      link: '#',
      disabled: this.isLoggedIn,
    },
  ];

  constructor(private http: HttpClient, private router: Router,private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
    this.checkUserRole();
  }
  logout() {
    this.isLoggedIn=false;
    this.authService.logout();
    this.router.navigate(['/events']);
  }

  // Check user role from JWT token
  checkUserRole() {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token); // Debug log
    if (token) {
      const decodedToken = this.decodeJwt(token);
      console.log('Decoded Token:', decodedToken); // Debug log

      if (decodedToken && (decodedToken.UserRole === 'Customer' || decodedToken.UserRole==='Admin')) {
        console.log('Role is Customer, fetching user profile...');
        this.fetchUserProfile(token);
        this.isLoggedIn=true;
      } else {
        this.isLoggedIn=true;
        console.warn('User role is not Customer or token is invalid.');
      }
    } else {
      console.warn('No token found in localStorage.');
    }
  }

  // Decode JWT token to extract information
  decodeJwt(token: string) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = atob(parts[1]); // Decode base64 string
        return JSON.parse(payload); // Convert JSON string to object
      }
    } catch (error) {
      console.error('Failed to decode JWT:', error);
    }
    return null;
  }

  // Fetch user profile from the API using the UserId in the token
  fetchUserProfile(token: string) {
    const decodedToken = this.decodeJwt(token);
    const userId = decodedToken?.UserId;
    console.log('UserID from token:', userId); // Debug log

    if (!userId) {
      console.error('UserID is missing from the token.');
      return;
    }

    const userProfileUrl = `${this.apiUrl}${userId}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Make the GET request to fetch user profile
    this.http.get<any>(userProfileUrl, { headers }).subscribe({
      next: (response) => {
        console.log('User profile fetched successfully:', response); // Debug log
        this.user = response; // Store user details
      },
      error: (err) => {
        console.error('Error fetching user profile:', err); // Error log
      },
    });
  }

  // Toggle the sidebar's visibility
  toggleSidebar() {
    this.isActive = !this.isActive;
  }

  // Open the login modal
  openLoginModal() {
    console.log('Open login modal logic to be implemented.');
  }
}
