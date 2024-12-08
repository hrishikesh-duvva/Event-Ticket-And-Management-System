import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';

interface Event {
  id: number;
  name: string;
  status: string;
}

interface User {
  id: number;
  name: string;
  status: string;
}

@Component({
  selector: 'app-adashboard',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './adashboard.component.html',
  styleUrls: ['./adashboard.component.css'],
})
export class AdashboardComponent  implements OnInit {

  totalEvents = 0;
  activeEvents = 0;
  totalUsers = 0;
  activeUsers = 0;
  suspiciousEvents: Event[] = [];
  events: Event[] = [];
  users: User[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.events = this.adminService.getEvents();
    this.users = this.adminService.getUsers();

    this.totalEvents = this.events.length;
    this.activeEvents = this.events.filter((event) => event.status === 'Active').length;
    this.suspiciousEvents = this.events.filter((event) => event.status === 'Suspicious');

    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter((user) => user.status === 'Active').length;
  }

  deleteEvent(id: number) {
    this.adminService.deleteEvent(id);

    // Update suspicious events and total events count
    this.suspiciousEvents = this.suspiciousEvents.filter((event) => event.id !== id);
    this.totalEvents--;
  }

}
