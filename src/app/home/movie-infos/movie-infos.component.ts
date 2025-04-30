import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {TmdbService} from '../../service/tmdb.service';
import {Movie} from '../../service/model/movie.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-movie-infos',
  imports: [
    DatePipe
  ],
  templateUrl: './movie-infos.component.html',
  styleUrl: './movie-infos.component.scss'
})
export class MovieInfosComponent implements OnInit, OnDestroy {
  public movieId: number = -1;

  tmdbService: TmdbService = inject(TmdbService);

  movie: Movie | undefined;

constructor() {
  effect(() => {
    this.movie = this.tmdbService.movieById().value;
  });
}

  ngOnInit(): void {
    this.fetchMovieById();
  }

  fetchMovieById(): void {
    this.tmdbService.getMovieById(this.movieId);
  }

  ngOnDestroy() {
    this.tmdbService.clearGetMovieById();
  }
}
