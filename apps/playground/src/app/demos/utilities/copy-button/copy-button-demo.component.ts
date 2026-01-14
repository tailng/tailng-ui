import { Component, signal } from '@angular/core';
import { TailngCopyButtonComponent } from '@tailng/ui';

@Component({
  selector: 'playground-copy-button-demo',
  standalone: true,
  imports: [TailngCopyButtonComponent],
  templateUrl: './copy-button-demo.component.html',
})
export class CopyButtonDemoComponent {
  readonly code = signal(`npm install @tailng/ui`);
}
