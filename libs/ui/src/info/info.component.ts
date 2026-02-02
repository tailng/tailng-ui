import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'tailng-info',
  templateUrl: './info.component.html',
})
export class TailngInfoComponent {
  readonly docsUrl = 'https://tailng.dev';
  readonly githubUrl = 'https://github.com/tociva/tailng';
}