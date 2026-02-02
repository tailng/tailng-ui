import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'tng-info',
  templateUrl: './info.component.html',
})
export class TngInfo {
  readonly docsUrl = 'https://tailng.dev';
  readonly githubUrl = 'https://github.com/tociva/tailng';
}