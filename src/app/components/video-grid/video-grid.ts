import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Video } from '../../models/video.model';
import { VideoPlayer } from '../video-player/video-player';

@Component({
  selector: 'app-video-grid',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressBarModule,
    VideoPlayer
  ],
  templateUrl: './video-grid.html',
  styleUrl: './video-grid.css'
})
export class VideoGrid implements OnInit {
  videos: Video[] = [];
  filteredVideos: Video[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Video[]>('assets/videos.json').subscribe({
      next: (data) => {
        this.videos = data;
        this.filteredVideos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching videos:', err);
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredVideos = this.videos.filter(video =>
      video.title.toLowerCase().includes(term) ||
      video.description.toLowerCase().includes(term)
    );
  }
}
