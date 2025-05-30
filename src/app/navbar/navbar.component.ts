import {Component, inject} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [FontAwesomeModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  searchTerm = '';

  router = inject(Router);

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    if(this.searchTerm.length >= 1) {
      this.router.navigate(['search'], {queryParams: {q: this.searchTerm}});
    } else if (this.searchTerm.length === 0) {
      this.router.navigate(['']);
    }
  }
}
