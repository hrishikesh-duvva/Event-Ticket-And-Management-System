import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  standalone: true,
  imports: [FormsModule],
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent {
  issue: string = ''; // User's issue input
  apiUrl = 'https://event-ticket-and-management-system-gpbefvcsbdfshffb.southindia-01.azurewebsites.net/api/SupportTicket';

  constructor(private http: HttpClient) {}

  submitIssue() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('User is not logged in.');
      return;
    }

    const decodedToken = this.decodeJwt(token); // Decode the JWT token
    if (!decodedToken || !decodedToken.UserId) {
      alert('Invalid user token.');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    if (!this.issue.trim()) {
      alert('Issue description is required.');
      return;
    }

    // Construct the payload including the nested User object
    const payload = {
      id: 0,
      userId: decodedToken.UserId, // Extracted from the token
      issue: this.issue.trim(),
      status: 'Pending', // Default status
      createdAt: new Date().toISOString(), // Current date and time
      user: {
        userId: decodedToken.UserId,
        username: decodedToken.Username || 'unknown', // If Username is missing
        passwordHash: 'string', // Placeholder
        role: decodedToken.UserRole || 'Customer', // Default to 'Customer' if missing
        email: 'string', // Placeholder
        phoneNumber: 'string', // Placeholder
        isActive: true, // Default to true
      },
    };

    console.log('Payload:', payload); // Debugging

    this.http.post(this.apiUrl, payload, { headers }).subscribe({
      next: (res: any) => {
        alert(res.message || 'Issue submitted successfully.');
        this.issue = ''; // Clear the form
      },
      error: (err) => {
        console.error('Error submitting issue:', err);
        alert('An error occurred while submitting your issue.');
      },
    });
  }

  // Decode JWT token
  decodeJwt(token: string) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = atob(parts[1]); // Decode Base64 payload
        return JSON.parse(payload); // Parse JSON payload
      }
    } catch (error) {
      console.error('Failed to decode JWT:', error);
    }
    return null;
  }
}
