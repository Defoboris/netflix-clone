import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieInfosComponent } from './movie-infos.component';

describe('MovieInfosComponent', () => {
  let component: MovieInfosComponent;
  let fixture: ComponentFixture<MovieInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieInfosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
