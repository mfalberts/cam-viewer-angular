import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoPlayer } from './video-player';

describe('VideoPlayer', () => {
  let component: VideoPlayer;
  let fixture: ComponentFixture<VideoPlayer>;

  beforeEach(async () => {
    // Mock RTCPeerConnection
    if (typeof (window as any).RTCPeerConnection === 'undefined') {
      (window as any).RTCPeerConnection = class {
        close() {}
        addTransceiver() {}
        createOffer() { return Promise.resolve({ sdp: 'mock-sdp' }); }
        setLocalDescription() { return Promise.resolve(); }
        setRemoteDescription() { return Promise.resolve(); }
      };
    }

    // Mock fetch
    (window as any).fetch = () =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('mock-answer-sdp')
      } as any);

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
    expect(videoEl.hasAttribute('autoplay')).toBe(true);
    expect(videoEl.hasAttribute('muted')).toBe(true);
  });

  it('should initialize WebRTC for application/webrtc type', async () => {
    let fetchCalled = false;
    (window as any).fetch = (url: string) => {
      if (url === 'http://test-whep') fetchCalled = true;
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve('mock-answer-sdp')
      } as any);
    };

    component.type = 'application/webrtc';
    component.src = 'http://test-whep';
    await (component as any).initVideo();
    expect(fetchCalled).toBe(true);
  });
});
