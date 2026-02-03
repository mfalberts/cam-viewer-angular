import { Component } from '@angular/core';
import { VideoGrid } from './components/video-grid/video-grid';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [VideoGrid],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'video-grid-app';
}
