import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import Hls from 'hls.js';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [],
  templateUrl: './video-player.html',
  styleUrl: './video-player.css'
})
export class VideoPlayer implements AfterViewInit, OnDestroy, OnChanges {
  @Input() src!: string;
  @Input() type!: string;
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  private hls?: Hls;
  private pc?: RTCPeerConnection;
  private isInitialized = false;

  ngAfterViewInit() {
    this.isInitialized = true;
    this.initVideo();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isInitialized && (changes['src'] || changes['type'])) {
      this.initVideo();
    }
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private cleanup() {
    if (this.hls) {
      this.hls.destroy();
      this.hls = undefined;
    }
    if (this.pc) {
      this.pc.close();
      this.pc = undefined;
    }
    if (this.videoElement?.nativeElement) {
      const video = this.videoElement.nativeElement;
      video.src = '';
      video.srcObject = null;
      video.load();
    }
  }

  private async initVideo() {
    this.cleanup();
    if (!this.src || !this.videoElement) return;

    const video = this.videoElement.nativeElement;

    if (this.type === 'application/x-mpegURL') {
      this.setupHls(video);
    } else if (this.type === 'application/webrtc') {
      await this.setupWhep(video);
    } else {
      // Standard MP4
      video.src = this.src;
    }
  }

  private setupHls(video: HTMLVideoElement) {
    if (Hls.isSupported()) {
      this.hls = new Hls({
        autoStartLoad: true,
        startLevel: -1,
      });
      this.hls.loadSource(this.src);
      this.hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.src;
    }
  }

  private async setupWhep(video: HTMLVideoElement) {
    try {
      this.pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      this.pc.addTransceiver('video', { direction: 'recvonly' });
      this.pc.addTransceiver('audio', { direction: 'recvonly' });

      this.pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          video.srcObject = event.streams[0];
        } else {
          const inboundStream = new MediaStream();
          inboundStream.addTrack(event.track);
          video.srcObject = inboundStream;
        }
      };

      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      const response = await fetch(this.src, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          'Content-Type': 'application/sdp'
        }
      });

      if (!response.ok) {
        throw new Error(`WHEP signaling failed: ${response.statusText}`);
      }

      const answerSdp = await response.text();
      await this.pc.setRemoteDescription({
        type: 'answer',
        sdp: answerSdp
      });

    } catch (error) {
      console.error('WebRTC/WHEP error:', error);
    }
  }
}
