import { Component, effect, inject, OnInit } from '@angular/core';
import { TmdbService } from '../../service/tmdb.service';
import { Movie, MovieApiResponse } from '../../service/model/movie.model';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-main-content',
  imports: [FontAwesomeModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent implements OnInit {
  tmdbService: TmdbService = inject(TmdbService);

  trendMovie: Movie | undefined;

  constructor() {
    effect(() => {
      const trendMovieResponse = this.tmdbService.fetchTrendMovie().value;
      if(trendMovieResponse){
        this.trendMovie = trendMovieResponse.results[0];
      }
    });
  };

  ngOnInit(): void {
    this.fetchMovieTrend();
  }
  fetchMovieTrend(): void {
    this.tmdbService.getTrend();
  }
}
