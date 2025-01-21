import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  standalone:true,
  imports: [FormsModule,CommonModule,RouterModule],
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent  implements OnInit {

  phoneNumber: string = '';
  otp: string = '';
  newPassword: string = '';
  otpSent: boolean = false;
  otpValidated: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    console.log('ForgotPasswordComponent initialized');
  }

  onSubmit(): void {
    // Call backend to send OTP
    this.authService.checkPhoneNumber(this.phoneNumber).subscribe((response: any) => {
      // console.log(response);
      if (response.exists) {
        this.otpSent = true;
        alert('OTP sent to your phone!');
      } else {
        alert('Phone number not found!');
      }
    });
  }

  validateOtp(): void {
    // Dummy validation
    if (this.otp.length === 6) {
      this.otpValidated = true;
      alert('OTP validated!');
    } else {
      alert('Invalid OTP!');
    }
  }

  updatePassword(): void {
    this.authService.updatePassword(this.phoneNumber, this.newPassword).subscribe(
      () => {
        alert('Password updated successfully!');
        this.router.navigate(['/signuphome']);
      },
      (error: any) => {
        alert('Error updating password. Try again!');
        console.error(error);
      }
    );
  }

}
