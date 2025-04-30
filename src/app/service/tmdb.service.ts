import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import {Movie, MovieApiResponse} from './model/movie.model';
import { State } from './model/state.model';
import { environment } from '../../environments/environment';
import {GenreResponse} from './model/genre.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MovieInfosComponent} from '../home/movie-infos/movie-infos.component';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {

  private http: HttpClient = inject(HttpClient);

  modelService = inject(NgbModal);

  private baseUrl: string = 'https://api.themoviedb.org';

  private fetchTrendMovieSignal$: WritableSignal<State<MovieApiResponse, HttpErrorResponse>> = signal(
    State.Builder<MovieApiResponse, HttpErrorResponse>().forInit().build()
  );
  fetchTrendMovie = computed(() => this.fetchTrendMovieSignal$());

  private genre$: WritableSignal<State<GenreResponse, HttpErrorResponse>> = signal(
    State.Builder<GenreResponse, HttpErrorResponse>().forInit().build()
  );
  genres = computed(() => this.genre$());

  private moviesByGenre$: WritableSignal<State<MovieApiResponse, HttpErrorResponse>> = signal(
    State.Builder<MovieApiResponse, HttpErrorResponse>().forInit().build()
  );
  moviesByGenre = computed(() => this.moviesByGenre$());

  private movieById$: WritableSignal<State<Movie, HttpErrorResponse>> = signal(
    State.Builder<Movie, HttpErrorResponse>().forInit().build()
  );
  movieById = computed(() => this.movieById$());

  private search$: WritableSignal<State<MovieApiResponse, HttpErrorResponse>> = signal(
    State.Builder<MovieApiResponse, HttpErrorResponse>().forInit().build()
  );
  search = computed(() => this.search$());

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
  };

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

  getImageURL(id: string, size: 'original' | 'w500' | 'w200'): string {
    return `https://image.tmdb.org/t/p/${size}/${id}`;
  }

  getMoviesByGenre(genreId: number): void {
    let queryParam = new HttpParams();
    queryParam = queryParam.set("language", "en-US");
    queryParam = queryParam.set("with_genres", genreId.toString());

    this.http.get<MovieApiResponse>(`${this.baseUrl}/3/discover/movie`, { headers: this.getHeaders(), params: queryParam }).subscribe({
      next: moviesByGenreResponse => {
        moviesByGenreResponse.genreId = genreId;
        this.moviesByGenre$
          .set(State.Builder<MovieApiResponse, HttpErrorResponse>()
            .forSuccess(moviesByGenreResponse).build())
      },
      error: error => {
        console.error('TMDB API Error:', error);
        this.moviesByGenre$.set(
          State.Builder<MovieApiResponse, HttpErrorResponse>().forError(error).build()
        );
      }
    });
  };

  getMovieById(id: number): void {
    this.http.get<Movie>(`${this.baseUrl}/3/movie/${id}`, { headers: this.getHeaders() }).subscribe({
      next: movieResponse => {
        this.movieById$
          .set(State.Builder<Movie, HttpErrorResponse>()
            .forSuccess(movieResponse).build())
      },
      error: error => {
        console.error('TMDB API Error:', error);
        this.movieById$.set(
          State.Builder<Movie, HttpErrorResponse>().forError(error).build()
        );
      }
    });
  };

  clearGetMovieById(): void {
    this.movieById$.set(State.Builder<Movie, HttpErrorResponse>().forInit().build());
  }

  openMoreInfos(movieId: number): void {
    let moreInfoModal = this.modelService.open(MovieInfosComponent);
    moreInfoModal.componentInstance.movieId = movieId;
  }

  searchByTerm(term: string): void {
    let queryParam = new HttpParams();
    queryParam = queryParam.set("language", "en-US");
    queryParam = queryParam.set("query", term);
    this.http.get<MovieApiResponse>(
      `${this.baseUrl}/3/search/movie`, {headers: this.getHeaders(), params: queryParam})
      .subscribe({
        next: searchByTerm => {
          this.search$
            .set(State.Builder<MovieApiResponse, HttpErrorResponse>()
              .forSuccess(searchByTerm).build())
        },
        error: err => {
          this.search$
            .set(State.Builder<MovieApiResponse, HttpErrorResponse>()
              .forError(err).build())
        }
      });
  }
  constructor() { }
}
