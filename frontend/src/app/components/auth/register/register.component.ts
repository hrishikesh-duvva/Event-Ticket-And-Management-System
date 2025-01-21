import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-uregister',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  role: string | null = '';
  loading :Boolean=false;

  constructor(private route: ActivatedRoute, private authService: AuthService,private router: Router) {}

  ngOnInit(): void {
    // Retrieve the dynamic option from the route parameter
    this.role = this.route.snapshot.paramMap.get('option');
  }

  username: string = '';
  password: string = '';
  email: string = '';
  phoneNumber: string = '';

  
  onClickLogin(): void {
    if (this.role) {
      this.router.navigate([`${this.role}/login`]);
      console.log(`Creating account for: ${this.role}`);

    } else {
      alert('Please select an option before creating an account.');
    }
  }

  registrationStatus: { message: string; type: string } | null = null;
  registrationDetails: any | null = null;

  onRegister() {
    const registerData = {
        Username: this.username,
        Password: this.password,
        Role: this.role,
        Email: this.email,
        PhoneNumber: this.phoneNumber,
    };

      console.log(registerData);
  this.authService
    .register(registerData)
    .pipe(
      tap({
        next: (response) => {
          console.log('Registration successful:', response);
          this.registrationStatus = {
            message: 'Registration was successful!',
            type: 'success',
            
          };
          this.registrationDetails = registerData; 
          setTimeout(() => {
            this.router.navigate(['/login']);
            console.log('Navigated to /login');
          }, 3000);
          this.loading = false;
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.registrationStatus = {
            message: 'Registration failed. Please try again.',
            type: 'error',
          };
          this.registrationDetails = null;
          this.loading = false;
        },
      })
    )
    .subscribe();
}
}