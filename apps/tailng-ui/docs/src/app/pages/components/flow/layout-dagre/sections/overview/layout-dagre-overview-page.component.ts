import { Component } from '@angular/core';
import { TngCodeBlockComponent } from '@tailng-ui/components';

@Component({
  selector: 'app-layout-dagre-overview-page',
  imports: [TngCodeBlockComponent],
  templateUrl: './layout-dagre-overview-page.component.html',
})
export class LayoutDagreOverviewPageComponent {
  protected readonly installCode = 'pnpm add @tailng-ui/flow @dagrejs/dagre';
  protected readonly providerCode = [
    "import { provideTngFlowLayoutEngine } from '@tailng-ui/flow';",
    "import { TNG_FLOW_DAGRE_LAYOUT_ENGINE } from '@tailng-ui/flow/layout-dagre';",
    '',
    'bootstrapApplication(AppComponent, {',
    '  providers: [provideTngFlowLayoutEngine(TNG_FLOW_DAGRE_LAYOUT_ENGINE)],',
    '});',
  ].join('\n');
  protected readonly editorCode = [
    "import { createTngFlowDagreLayoutEngine } from '@tailng-ui/flow/layout-dagre';",
    '',
    'readonly layoutEngine = createTngFlowDagreLayoutEngine<NodeData>();',
    '',
    '<tng-flow-editor',
    '  [definition]="workflow()"',
    '  [layoutEngine]="layoutEngine"',
    '  (nodesLayoutRequested)="applyLayout($event)"',
    '/>',
  ].join('\n');
}
