import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/Auth/auth.service'; // Adjust path
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0, height: '0px', overflow: 'hidden' })),
      transition('out => in', [
        style({ opacity: 0, height: '0px' }),
        animate('300ms ease-in', style({ opacity: 1, height: '*' }))
      ]),
      transition('in => out', [
        animate('300ms ease-out', style({ opacity: 0, height: '0px' }))
      ])
    ])
  ]
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  showMenu = false;
  isMobile = window.innerWidth <= 768;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.showMenu = false; // Reset menu state on desktop
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}