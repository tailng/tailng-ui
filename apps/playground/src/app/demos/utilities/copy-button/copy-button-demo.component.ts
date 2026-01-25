import { Component, signal } from '@angular/core';
import { TailngCopyButtonComponent } from '@tociva/tailng-ui';

@Component({
  selector: 'playground-copy-button-demo',
  standalone: true,
  imports: [TailngCopyButtonComponent],
  templateUrl: './copy-button-demo.component.html',
})
export class CopyButtonDemoComponent {
    readonly code = signal(`npm install @tociva/tailng-ui`);
}
