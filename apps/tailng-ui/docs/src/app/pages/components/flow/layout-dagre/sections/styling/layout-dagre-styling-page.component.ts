import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-layout-dagre-styling-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './layout-dagre-styling-page.component.html',
})
export class LayoutDagreStylingPageComponent {
  protected readonly requiredStylesCode = [
    '/* Dagre adds no stylesheet. Flow Editor styles are still required. */',
    "@import '@tailng-ui/flow/styles.css';",
  ].join('\n');
  protected readonly sizingCode = [
    'tng-flow-editor.workflow-canvas {',
    '  display: block;',
    '  height: min(70vh, 48rem);',
    '  min-height: 30rem;',
    '}',
  ].join('\n');
  protected readonly nodeSizingCode = [
    '.workflow-node {',
    '  inline-size: 18rem;',
    '  min-block-size: 7rem;',
    '}',
    '',
    '.workflow-node__description {',
    '  overflow-wrap: anywhere;',
    '}',
  ].join('\n');
}
