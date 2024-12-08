import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-alogin',
  standalone:true,
  imports:[CommonModule,RouterModule,FormsModule],
  templateUrl: './alogin.component.html',
  styleUrls: ['./alogin.component.scss'],
})
export class AloginComponent  implements OnInit {

  PhoneNumber: string = '';
    Password: string = '';
    Role:string | null ='Admin';

    constructor(private aadminService: AdminService,private router: Router,private authService:AuthService) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

    onLogin() {
        console.log(this.PhoneNumber, this.Password, this.Role!);
        this.authService.login({PhoneNumber:this.PhoneNumber, Password:this.Password, Role:this.Role!})
        .pipe(
            tap({
                next: (response) => {
                    console.log('Login successful', response);
                    localStorage.setItem('token', response.token);
                },
                error: (error) => {
                    console.error('Login failed', error);
                }
            })
        )
        .subscribe();
        this.router.navigate(['/admin/dashboard']);
    }
}
