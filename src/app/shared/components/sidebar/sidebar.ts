import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface NavItem {
  label: string;
  route: string;
  icon: 'home' | 'events' | 'guests' | 'templates';
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isOpen = input(false);
  userName = input('Usuario');

  closeSidebar = output<void>();
  logout = output<void>();

  readonly navItems: NavItem[] = [
    { label: 'Inicio', route: '/dashboard', icon: 'home' },
    { label: 'Mis eventos', route: '/events', icon: 'events' },
    { label: 'Invitados', route: '/guests', icon: 'guests' },
    { label: 'Plantillas', route: '/templates', icon: 'templates' },
  ];

  onNavClick(): void {
    this.closeSidebar.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }
}
