import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoPlayer } from './video-player';

describe('VideoPlayer', () => {
  let component: VideoPlayer;
  let fixture: ComponentFixture<VideoPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoPlayer]
    }).compileComponents();

    fixture = TestBed.createComponent(VideoPlayer);
    component = fixture.componentInstance;
    component.src = 'test.mp4';
    component.type = 'video/mp4';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have video element with autoplay and muted attributes', () => {
    const videoEl: HTMLVideoElement = fixture.nativeElement.querySelector('video');
    expect(videoEl).toBeTruthy();
    // Use hasAttribute for checking boolean attributes in JSDOM if properties are not reflecting
    expect(videoEl.hasAttribute('autoplay')).toBe(true);
    expect(videoEl.hasAttribute('muted')).toBe(true);
  });
});
