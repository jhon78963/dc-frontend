import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrl: './app.menu.component.scss',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];
  lang: any = '';

  getUserData() {
    const jsonData = localStorage.getItem('user');
    const userData = jsonData ? JSON.parse(jsonData) : undefined;
    return userData.role;
  }

  ngOnInit(): void {
    const isAdmin = this.getUserData();
    if (isAdmin == 'Admin') {
      this.model = [
        {
          label: 'Administración',
          icon: 'pi pi-home',
          items: [
            {
              label: 'Roles',
              icon: 'pi pi-fw pi-cog',
              routerLink: ['/administration/roles'],
            },
            {
              label: 'Usuarios',
              icon: 'pi pi-fw pi-users',
              routerLink: ['/administration/users'],
            },
          ],
        },
        {
          label: 'Productos',
          icon: 'pi pi-home',
          items: [
            {
              label: 'Marcas',
              icon: 'pi pi-fw pi-tags', 
              routerLink: ['/products/brands'],
            },
            {
              label: 'Categorías',
              icon: 'pi pi-fw pi-th-large', 
              routerLink: ['/administration/users'],
            },
            {
              label: 'Productos',
              icon: 'pi pi-fw pi-box',
              routerLink: ['/administration/users'],
            },
          ],
        },
      ];
    } else {
      this.model = [
        {
          label: 'Productos',
          icon: 'pi pi-home',
          items: [
            {
              label: 'Marcas',
              icon: 'pi pi-fw pi-tags', 
              routerLink: ['/products/brands'],
            },
            {
              label: 'Categorías',
              icon: 'pi pi-fw pi-th-large', 
              routerLink: ['/administration/users'],
            },
            {
              label: 'Productos',
              icon: 'pi pi-fw pi-box',
              routerLink: ['/administration/users'],
            },
          ],
        },
      ];
    }
  }
}
