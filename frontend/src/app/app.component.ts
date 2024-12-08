// app.component.ts
import { Component } from '@angular/core';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,  // Marking the component as standalone
  imports: [HeaderComponent, FooterComponent,RouterOutlet],  // Import dependent components and routing module
})
export class AppComponent {
  title = 'bms';
  toggleTheme() {
    document.body.classList.toggle('dark-theme');
  }

}
