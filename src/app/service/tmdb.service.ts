import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { MovieApiResponse } from './model/movie.model';
import { State } from './model/state.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {

  private http = inject(HttpClient);

  private baseUrl: string = 'https://api.themoviedb.org';

  private fetchTrendMovieSignal$: WritableSignal<State<MovieApiResponse, HttpErrorResponse>> = signal(
    State.Builder<MovieApiResponse, HttpErrorResponse>().forInit().build()
  );
  fetchTrendMovie = computed(() => this.fetchTrendMovieSignal$());

  getTrend(): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${environment.TMDB_API_KEY}`);

    this.http.get<MovieApiResponse>(`${this.baseUrl}/3/trending/movie/day`, { headers }).subscribe({
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
  }

  getImageURL(id: string, size: 'original' | 'w-500' | 'w-300'): string {
    return `https://image.tmdb.org/t/p/${size}/${id}`
  }

  constructor() { }
}
