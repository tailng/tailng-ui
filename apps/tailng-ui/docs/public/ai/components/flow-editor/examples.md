---
id: "components/flow-editor/examples"
title: "Flow Editor examples"
description: "Flow Editor examples reference for Angular applications."
category: "components"
status: "stable"
tags: ["flow-editor","flow","examples"]
package: "@tailng-ui/flow"
importPath: "@tailng-ui/flow"
sourcePaths: ["libs/tailng-ui/flow/src/lib/connection-template/tng-flow-connection-template.directive.ts","libs/tailng-ui/flow/src/lib/editor/tng-flow-connection-marker-diamond.directive.ts","libs/tailng-ui/flow/src/lib/editor/tng-flow-editor.component.ts","libs/tailng-ui/flow/src/lib/editor/tng-flow-foblex-bridge.directive.ts","libs/tailng-ui/flow/src/lib/editor/tng-flow-keyboard-config.ts","libs/tailng-ui/flow/src/lib/node/tng-flow-node.component.ts","libs/tailng-ui/flow/src/lib/node-template/tng-flow-node-template.directive.ts","libs/tailng-ui/flow/src/lib/node-palette/tng-flow-node-palette.component.ts","libs/tailng-ui/flow/src/lib/palette-item/tng-flow-palette-item.directive.ts","libs/tailng-ui/flow/src/lib/port/tng-flow-port.component.ts","libs/tailng-ui/flow/src/lib/validation-badge/tng-flow-validation-badge.component.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/routes.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/connection-routing-demo/connection-routing-demo-code.data.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/connection-routing-demo/connection-routing-demo.component.css","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/connection-routing-demo/connection-routing-demo.component.html","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/connection-routing-demo/connection-routing-demo.component.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/document-review-demo/document-review-demo-code.data.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/document-review-demo/document-review-demo.component.css","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/document-review-demo/document-review-demo.component.html","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/document-review-demo/document-review-demo.component.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/document-review-demo/document-review-workflow.data.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/flow-editor-examples-page/flow-editor-examples-code.data.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/flow-editor-examples-page/flow-editor-examples-page.component.css","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/flow-editor-examples-page/flow-editor-examples-page.component.html","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/flow-editor-examples-page/flow-editor-examples-page.component.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/professional-flow-builder-demo/professional-flow-builder-demo-code.data.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/professional-flow-builder-demo/professional-flow-builder-demo.component.css","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/professional-flow-builder-demo/professional-flow-builder-demo.component.html","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/professional-flow-builder-demo/professional-flow-builder-demo.component.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/professional-flow-builder-demo/professional-flow-builder-demo.global.css","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/timed-execution-demo/timed-execution-demo-code.data.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/timed-execution-demo/timed-execution-demo.component.css","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/timed-execution-demo/timed-execution-demo.component.html","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/timed-execution-demo/timed-execution-demo.component.ts","apps/tailng-ui/docs/src/app/pages/components/flow/flow-editor/sections/examples/timed-execution-demo/timed-execution-workflow.data.ts"]
humanDocsUrl: "https://tailng.dev/components/flow/flow-editor/examples"
componentGroup: "flow"
symbols: ["TngFlowConnectionMarkerDiamondDirective","TngFlowConnectionTemplateDirective","TngFlowEditorComponent","TngFlowFoblexBridgeDirective","TngFlowNodeComponent","TngFlowNodePaletteComponent","TngFlowNodeTemplateDirective","TngFlowPaletteItemDirective","TngFlowPortComponent","TngFlowValidationBadgeComponent"]
selectors: ["f-connection-marker-circle[tngFlowConnectionMarkerDiamond]","ng-template[tngFlowConnection], ng-template[tngFlowConnectionLabel]","tng-flow-editor","[tngFlowFoblexBridge]","tng-flow-node","tng-flow-node-palette","ng-template[tngFlowNode]","[tngFlowPaletteItem]","tng-flow-port","tng-flow-validation-badge"]
productId: "flow-editor"
section: "examples"
officialCatalog: true
generated: true
---

# Flow Editor examples

Routing stays in the workflow definition. Status and motion are transient presentation state. Select the first route to add, move, or remove waypoints.

Upload, extract, validate, and route a document through automatic approval or human review.

## Flow Editor examples

Explore a professional workflow builder, timed execution, connection editing and validation, controlled selection and deletion, editor modes, node movement, custom node composition, and read-only monitoring. Give each editor a unique `flowId` when multiple canvases share a page.

Hover a step, drag its + handle, and drop anywhere on another step.

Follow a linear order workflow while each connection remains visibly in progress before activating the next node.

### flow-builder.component.ts

```ts
import { Component, computed, signal, type OnDestroy } from '@angular/core';
import { TngFlowEditorComponent, type TngFlowPresentation } from '@tailng-ui/flow';
import { workflow } from './timed-workflow.data';

const nodeIds = ['receive', 'validate', 'approve', 'notify'] as const;
const connectionIds = [
  'receive-to-validate',
  'validate-to-approve',
  'approve-to-notify',
] as const;

@Component({
  selector: 'app-timed-execution',
  imports: [TngFlowEditorComponent],
  templateUrl: './timed-execution.component.html',
})
export class TimedExecutionComponent implements OnDestroy {
  readonly definition = workflow;
  readonly presentation = signal<TngFlowPresentation>({});
  readonly activeConnectionIndex = signal<number | null>(null);
  readonly remainingSeconds = signal(0);
  readonly running = computed(() => this.activeConnectionIndex() !== null);
  private timer: ReturnType<typeof setInterval> | undefined;

  runSimulation(): void {
    if (this.running()) return;
    this.activeConnectionIndex.set(0);
    this.remainingSeconds.set(3);
    this.presentation.set(this.presentationFor(0));
    this.timer = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private tick(): void {
    const remaining = this.remainingSeconds() - 1;
    if (remaining > 0) {
      this.remainingSeconds.set(remaining);
      return;
    }

    const current = this.activeConnectionIndex();
    if (current === null || current === connectionIds.length - 1) {
      this.stopTimer();
      this.activeConnectionIndex.set(null);
      this.remainingSeconds.set(0);
      this.presentation.set({
        nodes: Object.fromEntries(nodeIds.map((id) => [id, { status: 'completed' }])),
        connections: Object.fromEntries(
          connectionIds.map((id) => [id, { status: 'success' }]),
        ),
      });
      return;
    }

    const next = current + 1;
    this.activeConnectionIndex.set(next);
    this.remainingSeconds.set(3);
    this.presentation.set(this.presentationFor(next));
  }

  private presentationFor(activeIndex: number): TngFlowPresentation {
    return {
      nodes: Object.fromEntries(
        nodeIds.map((id, index) => [
          id,
          index <= activeIndex
            ? { status: 'completed' }
            : index === activeIndex + 1
              ? { status: 'waiting', highlighted: true }
              : { status: 'idle', dimmed: true },
        ]),
      ),
      connections: Object.fromEntries(
        connectionIds.map((id, index) => [
          id,
          index < activeIndex
            ? { status: 'success' }
            : index === activeIndex
              ? { status: 'active', motion: 'flow' }
              : { status: 'idle', dimmed: true },
        ]),
      ),
    };
  }

  private stopTimer(): void {
    if (this.timer !== undefined) clearInterval(this.timer);
    this.timer = undefined;
  }
}
```

### flow-builder.component.html

```html
<div class="timed-execution-toolbar">
  <button type="button" [disabled]="running()" (click)="runSimulation()">
    {{ running() ? 'Simulation running…' : 'Run simulation' }}
  </button>
  @if (running()) {
    <span aria-live="polite">
      Connection in progress — next node in {{ remainingSeconds() }}s
    </span>
  }
</div>

<tng-flow-editor
  flowId="timed-execution"
  ariaLabel="Automatic timed workflow simulation"
  [definition]="definition"
  [presentation]="presentation()"
  mode="inspect"
  [showSelectionArea]="false"
/>
```

### flow-builder.component.css

```css
.timed-execution-toolbar {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

tng-flow-editor {
  display: block;
  height: 30rem;
  min-height: 26rem;
}
```

### timed-execution.component.ts

```ts
import { Component, computed, signal, type OnDestroy } from '@angular/core';
import { TngFlowEditorComponent, type TngFlowPresentation } from '@tailng-ui/flow';
import { workflow } from './timed-workflow.data';

const nodeIds = ['receive', 'validate', 'approve', 'notify'] as const;
const connectionIds = [
  'receive-to-validate',
  'validate-to-approve',
  'approve-to-notify',
] as const;

@Component({
  selector: 'app-timed-execution',
  imports: [TngFlowEditorComponent],
  templateUrl: './timed-execution.component.html',
})
export class TimedExecutionComponent implements OnDestroy {
  readonly definition = workflow;
  readonly presentation = signal<TngFlowPresentation>({});
  readonly activeConnectionIndex = signal<number | null>(null);
  readonly remainingSeconds = signal(0);
  readonly running = computed(() => this.activeConnectionIndex() !== null);
  private timer: ReturnType<typeof setInterval> | undefined;

  runSimulation(): void {
    if (this.running()) return;
    this.activeConnectionIndex.set(0);
    this.remainingSeconds.set(3);
    this.presentation.set(this.presentationFor(0));
    this.timer = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private tick(): void {
    const remaining = this.remainingSeconds() - 1;
    if (remaining > 0) {
      this.remainingSeconds.set(remaining);
      return;
    }

    const current = this.activeConnectionIndex();
    if (current === null || current === connectionIds.length - 1) {
      this.stopTimer();
      this.activeConnectionIndex.set(null);
      this.remainingSeconds.set(0);
      this.presentation.set({
        nodes: Object.fromEntries(nodeIds.map((id) => [id, { status: 'completed' }])),
        connections: Object.fromEntries(
          connectionIds.map((id) => [id, { status: 'success' }]),
        ),
      });
      return;
    }

    const next = current + 1;
    this.activeConnectionIndex.set(next);
    this.remainingSeconds.set(3);
    this.presentation.set(this.presentationFor(next));
  }

  private presentationFor(activeIndex: number): TngFlowPresentation {
    return {
      nodes: Object.fromEntries(
        nodeIds.map((id, index) => [
          id,
          index <= activeIndex
            ? { status: 'completed' }
            : index === activeIndex + 1
              ? { status: 'waiting', highlighted: true }
              : { status: 'idle', dimmed: true },
        ]),
      ),
      connections: Object.fromEntries(
        connectionIds.map((id, index) => [
          id,
          index < activeIndex
            ? { status: 'success' }
            : index === activeIndex
              ? { status: 'active', motion: 'flow' }
              : { status: 'idle', dimmed: true },
        ]),
      ),
    };
  }

  private stopTimer(): void {
    if (this.timer !== undefined) clearInterval(this.timer);
    this.timer = undefined;
  }
}
```

### timed-execution.component.html

```html
<div class="timed-execution-toolbar">
  <button type="button" [disabled]="running()" (click)="runSimulation()">
    {{ running() ? 'Simulation running…' : 'Run simulation' }}
  </button>
  @if (running()) {
    <span aria-live="polite">
      Connection in progress — next node in {{ remainingSeconds() }}s
    </span>
  }
</div>

<tng-flow-editor
  flowId="timed-execution"
  ariaLabel="Automatic timed workflow simulation"
  [definition]="definition"
  [presentation]="presentation()"
  mode="inspect"
  [showSelectionArea]="false"
/>
```

### timed-execution.component.css

```css
.timed-execution-toolbar {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

tng-flow-editor {
  display: block;
  height: 30rem;
  min-height: 26rem;
}
```

### timed-workflow.data.ts

```ts
import type { TngFlowDefinition } from '@tailng-ui/flow';

export const workflow: TngFlowDefinition = {
  "id": "timed-execution-workflow",
  "name": "Timed order execution",
  "nodes": [
    {
      "id": "receive",
      "type": "source",
      "name": "Receive order",
      "description": "Accept the incoming order.",
      "position": {
        "x": 40,
        "y": 150
      },
      "ports": [
        {
          "id": "next",
          "name": "Order",
          "direction": "output",
          "kind": "control"
        }
      ]
    },
    {
      "id": "validate",
      "type": "processor",
      "name": "Validate order",
      "description": "Check inventory and payment.",
      "position": {
        "x": 370,
        "y": 150
      },
      "ports": [
        {
          "id": "input",
          "name": "Order",
          "direction": "input",
          "kind": "control",
          "required": true
        },
        {
          "id": "next",
          "name": "Validated",
          "direction": "output",
          "kind": "control"
        }
      ]
    },
    {
      "id": "approve",
      "type": "decision",
      "name": "Approve order",
      "description": "Commit the fulfilment decision.",
      "position": {
        "x": 700,
        "y": 150
      },
      "ports": [
        {
          "id": "input",
          "name": "Validated",
          "direction": "input",
          "kind": "control",
          "required": true
        },
        {
          "id": "next",
          "name": "Approved",
          "direction": "output",
          "kind": "control"
        }
      ]
    },
    {
      "id": "notify",
      "type": "target",
      "name": "Notify customer",
      "description": "Send the order confirmation.",
      "position": {
        "x": 1030,
        "y": 150
      },
      "ports": [
        {
          "id": "input",
          "name": "Approved",
          "direction": "input",
          "kind": "control",
          "required": true
        }
      ]
    }
  ],
  "connections": [
    {
      "id": "receive-to-validate",
      "source": {
        "nodeId": "receive",
        "portId": "next"
      },
      "target": {
        "nodeId": "validate",
        "portId": "input"
      }
    },
    {
      "id": "validate-to-approve",
      "source": {
        "nodeId": "validate",
        "portId": "next"
      },
      "target": {
        "nodeId": "approve",
        "portId": "input"
      }
    },
    {
      "id": "approve-to-notify",
      "source": {
        "nodeId": "approve",
        "portId": "next"
      },
      "target": {
        "nodeId": "notify",
        "portId": "input"
      }
    }
  ]
};
```
