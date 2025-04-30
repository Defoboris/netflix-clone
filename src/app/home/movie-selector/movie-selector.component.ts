import {Component, effect, inject, OnInit} from '@angular/core';
import {TmdbService} from '../../service/tmdb.service';
import {Genre} from '../../service/model/genre.model';
import {MovieListComponent} from './movie-list/movie-list.component';

@Component({
  selector: 'app-movie-selector',
  imports: [
    MovieListComponent
  ],
  templateUrl: './movie-selector.component.html',
  styleUrl: './movie-selector.component.scss'
})
export class MovieSelectorComponent implements OnInit {
  tmdbService: TmdbService = inject(TmdbService);

  genres: Genre[] | undefined;

  constructor() {
    effect(() => {
      let genresResponse = this.tmdbService.genres().value ?? { genres: [] };
      this.genres = genresResponse.genres;
    });
  }

  ngOnInit(): void {
    this.fetchAllGenres();
  }

  private fetchAllGenres(): void {
    this.tmdbService.getAllGenres();
  }

}
