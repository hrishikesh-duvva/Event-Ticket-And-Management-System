import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ulogin',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
    PhoneNumber: string = '';
    Password: string = '';
    Role:string | null ='';
    loginMessage: string | null = null; 
  isSuccess: boolean = false;

    constructor(private authService: AuthService,private route: ActivatedRoute,private router:Router) {}
    ngOnInit(): void {
      // Retrieve the dynamic option from the route parameter
      this.Role = this.route.snapshot.paramMap.get('option');
    }

    onLogin() {
        console.log(this.PhoneNumber, this.Password, this.Role!);
        const user={PhoneNumber:this.PhoneNumber, Password:this.Password, Role:this.Role!};
        this.authService.login(user)
        .pipe(
            tap({
                next: (response) => {
                    console.log('Login successful', response);
                    localStorage.setItem('token', response.token);
                    this.loginMessage = 'Login successful! Redirecting...';
                    this.isSuccess = true;

                    if(this.Role==='EventOrganizer'){
                        this.router.navigate(['/event-organiser/dashboard'])
                    }
                    else if(this.Role==='Customer'){
                        this.router.navigate(['/events'])
                    }
                },
                error: (error) => {
                    console.error('Login failed', error);
                    this.loginMessage = 'Login failed. Please check your credentials.';
                    this.isSuccess = false;
                }
            })
        )
        .subscribe();
    }
    
    onForgotPassword(): void {
        this.router.navigate(['/forgot-password']);
      }
    
}