import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/Auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
    animations: [
      // Fade-in animation for form
      trigger('fadeIn', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(-50px)' }),
          animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ]),
    ]
})
export class HomeComponent {
  constructor(public authService: AuthService) {}
}