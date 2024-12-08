import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportService } from '../../../services/support.service';
import { AuthService } from '../../../services/auth.service';
import { tap } from 'rxjs';
@Component({
  selector: 'app-slogin',
  standalone:true,
  imports:[CommonModule,RouterModule,FormsModule],
  templateUrl: './slogin.component.html',
  styleUrls: ['./slogin.component.css'],
})
export class SloginComponent  implements OnInit {

  PhoneNumber: string = '';
    Password: string = '';
    Role:string | null ='SupportAgent';

    constructor(private supportService: SupportService,private router: Router,private authService:AuthService) {}
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
        this.router.navigate(['/support/dashboard']);
    }

}
