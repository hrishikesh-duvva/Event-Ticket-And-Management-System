import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signuphome',
  templateUrl: './signuphome.component.html',
  styleUrl: './signuphome.component.css',
  standalone:true,
  imports:[CommonModule]
})
export class SignuphomeComponent {
  selectedOption: string = '';

  selectOption(option: string): void {
    this.selectedOption = option;
  }
  constructor(private router: Router) {}
  createAccount(): void {
    if (this.selectedOption) {
      this.router.navigate([`${this.selectedOption}/register`]);
      console.log(`Creating account for: ${this.selectedOption}`);
    } else {
      alert('Please select an option before creating an account.');
    }
  }
}
