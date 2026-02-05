import { Component, signal } from '@angular/core';
import { TngCopyButton } from '@tailng-ui/ui/utilities';
import { TngIcon } from "@tailng-ui/icons/icon";

@Component({
  selector: 'playground-copy-button-demo',
  standalone: true,
  imports: [TngCopyButton, TngIcon],
  templateUrl: './copy-button-demo.component.html',
})
export class CopyButtonDemoComponent {
    readonly code = signal(`npm install @tailng-ui/ui`);
}
