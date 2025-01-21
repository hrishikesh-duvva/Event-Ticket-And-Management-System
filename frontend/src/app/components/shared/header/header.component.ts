import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent],
})
export class HeaderComponent implements OnInit {
  searchContent: string = '';
  user: any = null; // Store the user data
  
  apiUrl = 'https://event-ticket-and-management-system-gpbefvcsbdfshffb.southindia-01.azurewebsites.net/api/User/'; 

  constructor(private router: Router, private http: HttpClient,private authService: AuthService,private eventService:EventService) {}

  cities = [
    'Mumbai', 'Delhi', 'Bengaluru', 'Kolkata', 'Chennai',
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Chandigarh',
    'Lucknow', 'Surat', 'Kanpur', 'Nagpur', 'Indore',
  ];
  selectedCity: string = '';

  isLoggedIn = false;



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

  // Handle search functionality
  onKey(event: any): void {
    const searchTerm = event.target.value.trim().toLowerCase();
    this.eventService.setCurrentSearchedName(searchTerm); // Notify the service
  }
  
  onCityChange(): void {
    if (this.selectedCity) {
      this.eventService.filterByCity(this.selectedCity.trim().toLowerCase());
    }
  }
  

  isSidebarActive: boolean = false;

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  // Check user role and decode token
  checkUserRole() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeJwt(token);
      if (decodedToken && decodedToken.UserRole === 'Customer' || decodedToken.UserRole === 'Admin') {
        this.fetchUserProfile(token);
        this.isLoggedIn=true;
      }
      else if(decodedToken ){
        this.isLoggedIn=true;
      }
    }
  }

  // Decode the JWT token
  decodeJwt(token: string) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = atob(parts[1]); // Decode Base64 payload
        return JSON.parse(payload); // Parse JSON payload
      }
    } catch (error) {
      console.error('Error decoding JWT token:', error);
    }
    return null;
  }

  // Fetch the user profile
  fetchUserProfile(token: string) {
    const decodedToken = this.decodeJwt(token);
    const userId = decodedToken?.UserId;

    if (!userId) {
      console.error('UserId is missing from the token');
      return;
    }

    const userProfileUrl = `${this.apiUrl}${userId}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>(userProfileUrl, { headers }).subscribe({
      next: (response) => {
        this.user = response; // Set the user data
      },
      error: (err) => {
        console.error('Error fetching user profile:', err);
      },
    });
  }
  onnClickhome(){
    this.router.navigate(['/events']);
  }
}
