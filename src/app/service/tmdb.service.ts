import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { MovieApiResponse } from './model/movie.model';
import { State } from './model/state.model';
import { environment } from '../../environments/environment';
import {GenreResponse} from './model/genre.model';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {

  private http: HttpClient = inject(HttpClient);

  private baseUrl: string = 'https://api.themoviedb.org';

  private fetchTrendMovieSignal$: WritableSignal<State<MovieApiResponse, HttpErrorResponse>> = signal(
    State.Builder<MovieApiResponse, HttpErrorResponse>().forInit().build()
  );
  fetchTrendMovie = computed(() => this.fetchTrendMovieSignal$());

  private genre$: WritableSignal<State<GenreResponse, HttpErrorResponse>> = signal(
    State.Builder<GenreResponse, HttpErrorResponse>().forInit().build()
  );
  genres = computed(() => this.genre$());

  getTrend(): void {
    this.http.get<MovieApiResponse>(`${this.baseUrl}/3/trending/movie/day`, { headers: this.getHeaders() }).subscribe({
      next: response => this.fetchTrendMovieSignal$.set(
        State.Builder<MovieApiResponse, HttpErrorResponse>().forSuccess(response).build()
      ),
      error: error => {
        console.error('TMDB API Error:', error);
        this.fetchTrendMovieSignal$.set(
          State.Builder<MovieApiResponse, HttpErrorResponse>().forError(error).build()
        );
      }
    });
  };

  getHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${environment.TMDB_API_KEY}`);
  }

  getAllGenres(): void {
    this.http.get<GenreResponse>(`${this.baseUrl}/3/genre/movie/list`, { headers: this.getHeaders() }).subscribe({
      next: genreResponse => this.genre$.set(
        State.Builder<GenreResponse, HttpErrorResponse>().forSuccess(genreResponse).build()
      ),
      error: error => {
        console.error('TMDB API Error:', error);
        this.genre$.set(
          State.Builder<GenreResponse, HttpErrorResponse>().forError(error).build()
        );
      }
    });
  };

  getImageURL(id: string, size: 'original' | 'w-500' | 'w-300'): string {
    return `https://image.tmdb.org/t/p/${size}/${id}`
  }

  constructor() { }
}
