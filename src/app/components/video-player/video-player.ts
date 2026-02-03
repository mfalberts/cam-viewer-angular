import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import Hls from 'hls.js';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [],
  templateUrl: './video-player.html',
  styleUrl: './video-player.css'
})
export class VideoPlayer implements AfterViewInit, OnDestroy {
  @Input() src!: string;
  @Input() type!: string;
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  private hls?: Hls;

  ngAfterViewInit() {
    this.initVideo();
  }

  ngOnDestroy() {
    if (this.hls) {
      this.hls.destroy();
    }
  }

  private initVideo() {
    const video = this.videoElement.nativeElement;

    if (this.type === 'application/x-mpegURL') {
      if (Hls.isSupported()) {
        this.hls = new Hls({
          autoStartLoad: true,
          startLevel: -1,
        });
        this.hls.loadSource(this.src);
        this.hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = this.src;
      }
    } else {
      // Standard MP4
      video.src = this.src;
    }
  }
}
