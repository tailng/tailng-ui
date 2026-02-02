import { Component, signal } from '@angular/core';
import { TailngCopyButtonComponent } from '@tociva/tailng-ui/utilities';
import { TailngIconComponent } from "@tociva/tailng-icons/icon";

@Component({
  selector: 'playground-copy-button-demo',
  standalone: true,
  imports: [TailngCopyButtonComponent, TailngIconComponent],
  templateUrl: './copy-button-demo.component.html',
})
export class CopyButtonDemoComponent {
    readonly code = signal(`npm install @tociva/tailng-ui`);
}
