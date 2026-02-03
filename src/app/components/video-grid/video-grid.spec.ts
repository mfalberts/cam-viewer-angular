import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoGrid } from './video-grid';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('VideoGrid', () => {
  let component: VideoGrid;
  let fixture: ComponentFixture<VideoGrid>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoGrid],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimationsAsync()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoGrid);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create and fetch videos', () => {
    fixture.detectChanges(); // triggers ngOnInit

    const req = httpMock.expectOne('assets/videos.json');
    req.flush([]);

    expect(component).toBeTruthy();
  });

  it('should filter videos based on search term', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('assets/videos.json');
    req.flush([
      { id: 1, title: 'Apple', description: 'Desc 1', url: 'url1', type: 'video/mp4' },
      { id: 2, title: 'Banana', description: 'Desc 2', url: 'url2', type: 'video/mp4' }
    ]);

    component.searchTerm = 'apple';
    component.onSearch();
    expect(component.filteredVideos.length).toBe(1);
    expect(component.filteredVideos[0].title).toBe('Apple');

    component.searchTerm = 'desc';
    component.onSearch();
    expect(component.filteredVideos.length).toBe(2);
  });
});
