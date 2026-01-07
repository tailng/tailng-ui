import { Component } from '@angular/core';
import { TailngSkeletonComponent } from '@tailng/ui';

@Component({
  selector: 'playground-skeleton-demo',
  standalone: true,
  imports: [TailngSkeletonComponent],
  templateUrl: './skeleton-demo.component.html',
})
export class SkeletonDemoComponent {}

