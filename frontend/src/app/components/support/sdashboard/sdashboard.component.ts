import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface Issue {
  id: number;
  issue: string;
  status: string;
  createdAt: string;
  user: {
    userId: number;
    username: string;
    email: string;
    phoneNumber: string;
  } | null; // User might be null in some cases.
}

@Component({
  selector: 'app-sdashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sdashboard.component.html',
  styleUrls: ['./sdashboard.component.css'],
})
export class SdashboardComponent implements OnInit {
  issues: Issue[] = []; // Use the Issue interface
  apiUrl = 'https://event-ticket-and-management-system-gpbefvcsbdfshffb.southindia-01.azurewebsites.net/api/SupportTicket';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchIssues(); // Fetch issues on component load
  }

  fetchIssues() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found.');
      return;
    }
  
    const headers = { Authorization: `Bearer ${token}` };
  
    this.http.get<{ $values: Issue[] }>(this.apiUrl, { headers }).subscribe({
      next: (res) => {
        console.log('Fetched issues:', res);
        // Extract the issues from $values
        this.issues = (res.$values || []).map((issue) => ({
          ...issue,
          user: issue.user || { userId: 0, username: 'Unknown', email: 'Unknown', phoneNumber: 'Unknown' },
        }));
      },
      error: (err) => {
        console.error('Error fetching issues:', err);
      },
    });
  }
  
  

  resolveIssue(issueId: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found.');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.put(`${this.apiUrl}/${issueId}`, {}, { headers }).subscribe({
      next: () => {
        alert('Issue marked as resolved.');
        this.fetchIssues(); // Refresh the issues list
      },
      error: (err) => {
        console.error('Error resolving issue:', err);
      },
    });
  }
}
