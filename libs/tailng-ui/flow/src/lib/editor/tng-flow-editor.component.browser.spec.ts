import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import '../../../styles.css';
import { TngFlowEditorComponent } from './tng-flow-editor.component';
import { TngFlowConnectionTemplateDirective } from '../connection-template/tng-flow-connection-template.directive';
import { TngFlowNodeTemplateDirective } from '../node-template/tng-flow-node-template.directive';
import type { TngFlowNodesArrangementRequest } from '../types/tng-flow-arrangement.types';
import type { TngFlowEditorCommandRequest } from '../types/tng-flow-command.types';
import type { TngFlowConnectionPathType } from '../types/tng-flow-connection.types';
import type { TngFlowContextMenuRequest } from '../types/tng-flow-context-menu.types';
import type {
  TngFlowLayoutEngine,
  TngFlowLayoutGraph,
  TngFlowNodesLayoutRequest,
} from '../types/tng-flow-layout.types';
import type { TngFlowPresentation } from '../types/tng-flow-presentation.types';
import type {
  TngFlowConnectionCandidate,
  TngFlowConnectionType,
  TngFlowDefinition,
  TngFlowViewport,
} from '../types/tng-flow.types';

const definition: TngFlowDefinition = Object.freeze({
  id: 'browser-contract',
  nodes: Object.freeze([
    Object.freeze({
      id: 'start',
      type: 'start',
      name: 'Start',
      position: Object.freeze({ x: 40, y: 80 }),
      ports: Object.freeze([Object.freeze({ id: 'next', direction: 'output', kind: 'control' })]),
    }),
    Object.freeze({
      id: 'finish',
      type: 'finish',
      name: 'Finish',
      position: Object.freeze({ x: 440, y: 80 }),
      ports: Object.freeze([
        Object.freeze({ id: 'previous', direction: 'input', kind: 'control' }),
      ]),
    }),
  ]),
  connections: Object.freeze([
    Object.freeze({
      id: 'start-to-finish',
      source: Object.freeze({ nodeId: 'start', portId: 'next' }),
      target: Object.freeze({ nodeId: 'finish', portId: 'previous' }),
    }),
  ]),
});

const multiNodeDefinition: TngFlowDefinition = Object.freeze({
  id: 'multi-node-keyboard-contract',
  nodes: Object.freeze([
    ...definition.nodes,
    Object.freeze({
      id: 'locked',
      type: 'locked',
      name: 'Locked',
      position: Object.freeze({ x: 240, y: 320 }),
      locked: true,
      ports: Object.freeze([]),
    }),
    Object.freeze({
      id: 'disabled',
      type: 'disabled',
      name: 'Disabled',
      position: Object.freeze({ x: 560, y: 320 }),
      disabled: true,
      ports: Object.freeze([]),
    }),
  ]),
  connections: definition.connections,
});

const multiPortDefinition: TngFlowDefinition = Object.freeze({
  id: 'multi-port-keyboard-contract',
  nodes: Object.freeze([
    Object.freeze({
      id: 'source',
      type: 'source',
      name: 'Source',
      position: Object.freeze({ x: 40, y: 120 }),
      ports: Object.freeze([
        Object.freeze({
          id: 'control-output',
          name: 'Control',
          direction: 'output',
          kind: 'control',
          side: 'right',
        }),
        Object.freeze({
          id: 'data-output',
          name: 'Data',
          direction: 'output',
          kind: 'data',
          side: 'bottom',
        }),
        Object.freeze({
          id: 'disabled-output',
          name: 'Disabled output',
          direction: 'output',
          kind: 'data',
          disabled: true,
          side: 'top',
        }),
      ]),
    }),
    Object.freeze({
      id: 'control-target',
      type: 'target',
      name: 'Control target',
      position: Object.freeze({ x: 480, y: 80 }),
      ports: Object.freeze([
        Object.freeze({
          id: 'control-input',
          name: 'Control input',
          direction: 'input',
          kind: 'control',
        }),
      ]),
    }),
    Object.freeze({
      id: 'data-target',
      type: 'target',
      name: 'Data target',
      position: Object.freeze({ x: 480, y: 360 }),
      ports: Object.freeze([
        Object.freeze({
          id: 'rejected-input',
          name: 'Rejected input',
          direction: 'input',
          kind: 'data',
        }),
        Object.freeze({
          id: 'data-input',
          name: 'Data input',
          direction: 'input',
          kind: 'data',
        }),
        Object.freeze({
          id: 'disabled-input',
          name: 'Disabled input',
          direction: 'input',
          kind: 'data',
          disabled: true,
        }),
      ]),
    }),
    Object.freeze({
      id: 'locked-target',
      type: 'target',
      name: 'Locked target',
      position: Object.freeze({ x: 800, y: 360 }),
      locked: true,
      ports: Object.freeze([
        Object.freeze({
          id: 'locked-input',
          name: 'Locked input',
          direction: 'input',
          kind: 'data',
        }),
      ]),
    }),
  ]),
  connections: Object.freeze([]),
});

@Component({
  imports: [TngFlowEditorComponent, TngFlowNodeTemplateDirective],
  template: `
    <tng-flow-editor
      [definition]="definition"
      [commandShortcuts]="true"
      [contextMenuEnabled]="true"
      [fitOnInit]="false"
    >
      <ng-template tngFlowNode="start">
        <label>
          Prompt
          <input aria-label="Prompt" />
        </label>
        <textarea aria-label="Notes"></textarea>
        <select aria-label="Model">
          <option>Default</option>
        </select>
        <button type="button">Run</button>
        <a href="#keyboard-contract">Help</a>
        <details>
          <summary>Advanced</summary>
          Settings
        </details>
        <div contenteditable="true">Editable</div>
        <div role="switch" aria-checked="false" tabindex="0">Custom switch</div>
      </ng-template>
    </tng-flow-editor>
  `,
})
class BrowserFormControlHost {
  protected readonly definition = definition;
}

@Component({
  imports: [TngFlowEditorComponent],
  template: `
    <tng-flow-editor
      style="--tng-semantic-foreground-primary: rgb(40, 80, 120)"
      [style.--tng-flow-grid-color]="gridColor()"
      [definition]="definition"
      [fitOnInit]="false"
      [showBackground]="showBackground()"
      [showControls]="false"
      [snapToGrid]="true"
      [gridSize]="24"
      backgroundGridMode="adaptive"
      [viewport]="viewport()"
      [zoomMinimum]="0.18"
    />
  `,
})
class BrowserGridHost {
  protected readonly definition = definition;
  public readonly showBackground = signal(true);
  public readonly gridColor = signal<string | null>(null);
  public readonly viewport = signal<TngFlowViewport>({
    position: { x: 0, y: 0 },
    scale: 1,
  });
}

const connectionGeometries: readonly TngFlowConnectionType[] = [
  'adaptive-curve',
  'bezier',
  'segment',
  'straight',
];
const routedConnectionTypes: readonly TngFlowConnectionPathType[] = [
  'straight',
  'bezier',
  'orthogonal',
  'orthogonal-rounded',
  'adaptive',
];

function createConnectionGeometryDefinition(targetOffset = 0): TngFlowDefinition {
  return {
    id: 'connection-label-geometries',
    nodes: connectionGeometries.flatMap((geometry, index) => {
      const y = 32 + index * 135;
      return [
        {
          id: `${geometry}-source`,
          type: 'source',
          name: `${geometry} source`,
          position: { x: 40, y },
          ports: [{ id: 'output', direction: 'output', kind: 'data' }],
        },
        {
          id: `${geometry}-target`,
          type: 'target',
          name: `${geometry} target`,
          position: { x: 520 + targetOffset, y: y + (index % 2 === 0 ? 24 : -12) },
          ports: [{ id: 'input', direction: 'input', kind: 'data' }],
        },
      ];
    }),
    connections: connectionGeometries.map((geometry) => ({
      id: `${geometry}-connection`,
      source: { nodeId: `${geometry}-source`, portId: 'output' },
      target: { nodeId: `${geometry}-target`, portId: 'input' },
      label: `${geometry} approval route with a complete accessible name that must remain available`,
      description: `Runtime route rendered using ${geometry} geometry.`,
      type: geometry,
    })),
  };
}

function createRoutedConnectionDefinition(): TngFlowDefinition {
  return {
    id: 'tailng-routing-geometries',
    nodes: routedConnectionTypes.flatMap((pathType, index) => {
      const y = 24 + index * 125;
      return [
        {
          id: `${pathType}-routing-source`,
          type: 'source',
          name: `${pathType} routing source`,
          position: { x: 32, y },
          ports: [{ id: 'output', direction: 'output', kind: 'control' }],
        },
        {
          id: `${pathType}-routing-target`,
          type: 'target',
          name: `${pathType} routing target`,
          position: { x: 540, y: y + 52 },
          ports: [{ id: 'input', direction: 'input', kind: 'control' }],
        },
      ];
    }),
    connections: routedConnectionTypes.map((pathType) => ({
      id: `${pathType}-routing-connection`,
      source: { nodeId: `${pathType}-routing-source`, portId: 'output' },
      target: { nodeId: `${pathType}-routing-target`, portId: 'input' },
      label: pathType,
      routing: {
        type: pathType,
        offset: 24,
        radius: pathType === 'orthogonal-rounded' ? 16 : 0,
        waypoints:
          pathType === 'orthogonal-rounded'
            ? [
                { x: 330, y: 420 },
                { x: 390, y: 460 },
              ]
            : undefined,
      },
      targetMarker: 'arrow',
    })),
  };
}

function createPerformanceDefinition(connectionCount: number): TngFlowDefinition {
  const targetCount = 10;
  const sourceCount = Math.ceil(connectionCount / targetCount);
  const sources = Array.from({ length: sourceCount }, (_, index) => ({
    id: `performance-source-${index}`,
    type: 'source',
    name: `Source ${index + 1}`,
    position: { x: 24 + (index % 5) * 180, y: 24 + Math.floor(index / 5) * 132 },
    ports: [
      {
        id: 'output',
        direction: 'output' as const,
        kind: 'data' as const,
        multiple: true,
      },
    ],
  }));
  const targets = Array.from({ length: targetCount }, (_, index) => ({
    id: `performance-target-${index}`,
    type: 'target',
    name: `Target ${index + 1}`,
    position: { x: 1120, y: 24 + index * 132 },
    ports: [
      {
        id: 'input',
        direction: 'input' as const,
        kind: 'data' as const,
        multiple: true,
      },
    ],
  }));
  return {
    id: `performance-${connectionCount}`,
    nodes: [...sources, ...targets],
    connections: Array.from({ length: connectionCount }, (_, index) => ({
      id: `performance-connection-${index}`,
      source: {
        nodeId: `performance-source-${Math.floor(index / targetCount)}`,
        portId: 'output',
      },
      target: {
        nodeId: `performance-target-${index % targetCount}`,
        portId: 'input',
      },
      routing: { type: 'orthogonal-rounded' as const, radius: 8, offset: 16 },
    })),
  };
}

function createPerformancePresentation(animatedCount: number): TngFlowPresentation {
  return {
    connections: Object.fromEntries(
      Array.from({ length: animatedCount }, (_, index) => [
        `performance-connection-${index}`,
        {
          status: 'active',
          motion: 'flow',
          motionSpeed: 'normal',
          motionDirection: 'forward',
        },
      ]),
    ),
  };
}

const resizableFlowDefinition: TngFlowDefinition = Object.freeze({
  id: 'resizable-flow-contract',
  nodes: Object.freeze([
    Object.freeze({
      id: 'upper-source',
      type: 'step',
      name: 'Upper source',
      position: Object.freeze({ x: 40, y: 72 }),
      ports: Object.freeze([
        Object.freeze({
          id: 'custom-point-out-right-1',
          direction: 'output',
          kind: 'data',
          side: 'right',
        }),
      ]),
    }),
    Object.freeze({
      id: 'upper-target',
      type: 'step',
      name: 'Upper target',
      position: Object.freeze({ x: 560, y: 120 }),
      ports: Object.freeze([
        Object.freeze({
          id: 'custom-point-in-left-1',
          direction: 'input',
          kind: 'data',
          side: 'left',
        }),
      ]),
    }),
    Object.freeze({
      id: 'lower-source',
      type: 'step',
      name: 'Lower source',
      position: Object.freeze({ x: 40, y: 352 }),
      ports: Object.freeze([
        Object.freeze({
          id: 'custom-point-out-right-2',
          direction: 'output',
          kind: 'control',
          side: 'right',
        }),
      ]),
    }),
    Object.freeze({
      id: 'lower-target',
      type: 'step',
      name: 'Lower target',
      position: Object.freeze({ x: 560, y: 400 }),
      ports: Object.freeze([
        Object.freeze({
          id: 'custom-point-in-left-2',
          direction: 'input',
          kind: 'control',
          side: 'left',
        }),
      ]),
    }),
  ]),
  connections: Object.freeze([
    Object.freeze({
      id: 'rounded-edge',
      source: Object.freeze({
        nodeId: 'upper-source',
        portId: 'custom-point-out-right-1',
      }),
      target: Object.freeze({
        nodeId: 'upper-target',
        portId: 'custom-point-in-left-1',
      }),
      routing: Object.freeze({
        type: 'orthogonal-rounded',
        offset: 24,
        radius: 12,
        waypoints: Object.freeze([
          Object.freeze({ x: 360, y: 110 }),
          Object.freeze({ x: 420, y: 190 }),
        ]),
      }),
    }),
    Object.freeze({
      id: 'adaptive-edge',
      source: Object.freeze({
        nodeId: 'lower-source',
        portId: 'custom-point-out-right-2',
      }),
      target: Object.freeze({
        nodeId: 'lower-target',
        portId: 'custom-point-in-left-2',
      }),
      routing: Object.freeze({
        type: 'adaptive',
        offset: 20,
      }),
    }),
  ]),
});

@Component({
  imports: [TngFlowConnectionTemplateDirective, TngFlowEditorComponent],
  template: `
    <tng-flow-editor
      [definition]="definition()"
      [selection]="selection"
      [viewport]="viewport()"
      [fitOnInit]="false"
      [showControls]="false"
    >
      <ng-template tngFlowConnectionLabel let-connection>
        <span data-testid="browser-custom-connection-label">{{ connection.label }}</span>
      </ng-template>
    </tng-flow-editor>
  `,
})
class BrowserConnectionTemplateHost {
  public readonly definition = signal(createConnectionGeometryDefinition());
  public readonly viewport = signal({ position: { x: 0, y: 0 }, scale: 1 });
  protected readonly selection = {
    nodeIds: new Set<string>(),
    connectionIds: new Set(['adaptive-curve-connection']),
  };
}

@Component({
  imports: [TngFlowEditorComponent],
  template: `
    <tng-flow-editor
      [definition]="definition"
      [presentation]="presentation"
      [connectionOptions]="connectionOptions()"
      [fitOnInit]="false"
    />
  `,
})
class BrowserMotionHost {
  public readonly connectionOptions = signal({ motionPreference: 'disabled' as const });
  protected readonly definition = definition;
  protected readonly presentation = {
    connections: {
      'start-to-finish': {
        status: 'warning' as const,
        motion: 'pulse' as const,
        message: 'Waiting for approval',
      },
    },
  };
}

@Component({
  imports: [TngFlowEditorComponent],
  template: `
    <tng-flow-editor
      [definition]="definition()"
      [viewport]="viewport()"
      [fitOnInit]="false"
      [showControls]="false"
      [showMinimap]="true"
      (viewportChange)="updateViewport($event)"
    />
  `,
})
class BrowserControlledMinimapHost {
  public readonly definition = signal<TngFlowDefinition>(definition);
  public readonly viewport = signal<TngFlowViewport>({
    position: { x: 0, y: 0 },
    scale: 1,
  });
  public readonly viewportChangeCount = signal(0);

  public updateViewport(viewport: TngFlowViewport): void {
    this.viewport.set(viewport);
    this.viewportChangeCount.update((count) => count + 1);
    this.definition.update((current) => ({
      ...current,
      nodes: current.nodes.map((node) => ({ ...node, position: { ...node.position } })),
      connections: current.connections.map((connection) => ({
        ...connection,
        source: { ...connection.source },
        target: { ...connection.target },
      })),
    }));
  }
}

@Component({
  imports: [TngFlowEditorComponent],
  styles: `
    .resizable-shell {
      width: 1000px;
      height: 580px;
    }

    .resizable-shell--animated {
      transition:
        width 160ms linear,
        height 160ms linear;
    }

    .resizable-shell--collapsed {
      width: 700px;
      height: 480px;
    }

    tng-flow-editor {
      height: 100%;
      min-height: 0;
    }
  `,
  template: `
    <div
      class="resizable-shell"
      [class.resizable-shell--animated]="animated()"
      [class.resizable-shell--collapsed]="collapsed()"
    >
      <tng-flow-editor
        attachmentLayout="custom-points"
        [definition]="definition"
        [fitOnInit]="false"
        [showControls]="false"
        [showMinimap]="true"
        [viewport]="viewport"
        (viewportChange)="recordViewportChange()"
      />
    </div>
  `,
})
class BrowserResizableFlowHost {
  public readonly animated = signal(false);
  public readonly collapsed = signal(false);
  public readonly viewportChangeCount = signal(0);
  public readonly definition = resizableFlowDefinition;
  public readonly viewport: TngFlowViewport = {
    position: { x: 24, y: -16 },
    scale: 0.82,
  };

  public recordViewportChange(): void {
    this.viewportChangeCount.update((count) => count + 1);
  }
}

function nextPaint(): Promise<void> {
  return new Promise((resolvePaint) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolvePaint()));
  });
}

function maxBoxShadowSpread(boxShadow: string): number {
  return Math.max(
    0,
    ...(boxShadow.match(/-?\d*\.?\d+px/g)?.map((value) => Number.parseFloat(value)) ?? []),
  );
}

async function waitForRenderedConnectionPaths(host: HTMLElement): Promise<void> {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const paths = host.querySelectorAll<SVGPathElement>('[data-connection-id] .f-connection-path');
    if (
      paths.length > 0 &&
      [...paths].every((path) => (path.getAttribute('d')?.trim().length ?? 0) > 0)
    ) {
      return;
    }
    await nextPaint();
  }
  throw new Error('Timed out waiting for connection paths to render.');
}

function expectContentAtPathMidpoint(connection: HTMLElement): void {
  const content = connection.querySelector<HTMLElement>('[data-connection-content]');
  const paths = connection.querySelectorAll<SVGPathElement>('.f-connection-path');
  let path: SVGPathElement | null = null;
  for (let index = 0; index < paths.length; index += 1) {
    const candidate = paths.item(index);
    if ((candidate.getAttribute('d')?.trim().length ?? 0) > 0) {
      path = candidate;
      break;
    }
  }
  if (content === null || path === null) {
    throw new Error('Expected a connection path and midpoint content.');
  }
  const matrix: DOMMatrix | null = path.getScreenCTM();
  if (matrix === null) {
    throw new Error('Expected the connection path to have a screen transform.');
  }
  const midpoint: DOMPoint = path.getPointAtLength(path.getTotalLength() / 2);
  const screenMidpoint: DOMPoint = midpoint.matrixTransform(matrix);
  const contentBounds = content.getBoundingClientRect();
  const contentCenter = {
    x: contentBounds.left + contentBounds.width / 2,
    y: contentBounds.top + contentBounds.height / 2,
  };

  expect(Math.abs(contentCenter.x - screenMidpoint.x)).toBeLessThan(5);
  expect(Math.abs(contentCenter.y - screenMidpoint.y)).toBeLessThan(5);
}

function connectorAnchor(port: HTMLElement): Readonly<{ x: number; y: number }> {
  const socket = port.querySelector<HTMLElement>('.tng-flow-editor__port-socket');
  if (socket === null) {
    throw new Error('Expected the port connector socket to render.');
  }
  const rect = socket.getBoundingClientRect();
  const side = port.dataset['side'];
  if (side === undefined) {
    throw new Error('Expected the port to declare a connector side.');
  }
  switch (side) {
    case 'bottom':
      return { x: rect.left + rect.width / 2, y: rect.bottom };
    case 'left':
      return { x: rect.left, y: rect.top + rect.height / 2 };
    case 'right':
      return { x: rect.right, y: rect.top + rect.height / 2 };
    case 'top':
      return { x: rect.left + rect.width / 2, y: rect.top };
    default:
      throw new Error(`Unsupported connector side "${side}".`);
  }
}

function pathScreenEndpoint(
  path: SVGPathElement,
  atEnd: boolean,
): Readonly<{ x: number; y: number }> {
  const matrix = path.getScreenCTM();
  if (matrix === null) {
    throw new Error('Expected the connection path to have a screen transform.');
  }
  const point = path.getPointAtLength(atEnd ? path.getTotalLength() : 0).matrixTransform(matrix);
  return { x: point.x, y: point.y };
}

function nearestPathEndpointDistance(
  paths: readonly SVGPathElement[],
  anchor: Readonly<{ x: number; y: number }>,
): number {
  return Math.min(
    ...paths.flatMap((path) =>
      [false, true].map((atEnd) => {
        const point = pathScreenEndpoint(path, atEnd);
        return Math.hypot(point.x - anchor.x, point.y - anchor.y);
      }),
    ),
  );
}

type ConnectionAttachmentExpectation = Readonly<{
  connectionId: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
}>;

function expectConnectionAttached(
  host: HTMLElement,
  expectation: ConnectionAttachmentExpectation,
): void {
  const { connectionId, sourceNodeId, sourcePortId, targetNodeId, targetPortId } = expectation;
  const paths = [
    ...host.querySelectorAll<SVGPathElement>(
      `[data-connection-id="${connectionId}"] .f-connection-path`,
    ),
  ].filter((path) => (path.getAttribute('d')?.trim().length ?? 0) > 0);
  const source = host.querySelector<HTMLElement>(
    `[data-node-id="${sourceNodeId}"] > [data-port-id="${sourcePortId}"]`,
  );
  const target = host.querySelector<HTMLElement>(
    `[data-node-id="${targetNodeId}"] > [data-port-id="${targetPortId}"]`,
  );
  if (paths.length === 0 || source === null || target === null) {
    throw new Error(`Expected rendered geometry for connection "${connectionId}".`);
  }
  const sourceAnchor = connectorAnchor(source);
  const targetAnchor = connectorAnchor(target);

  expect(nearestPathEndpointDistance(paths, sourceAnchor)).toBeLessThan(3);
  expect(nearestPathEndpointDistance(paths, targetAnchor)).toBeLessThan(3);
}

function expectResizableConnectionsAttached(host: HTMLElement): void {
  expectConnectionAttached(host, {
    connectionId: 'rounded-edge',
    sourceNodeId: 'upper-source',
    sourcePortId: 'custom-point-out-right-1',
    targetNodeId: 'upper-target',
    targetPortId: 'custom-point-in-left-1',
  });
  expectConnectionAttached(host, {
    connectionId: 'adaptive-edge',
    sourceNodeId: 'lower-source',
    sourcePortId: 'custom-point-out-right-2',
    targetNodeId: 'lower-target',
    targetPortId: 'custom-point-in-left-2',
  });
}

async function waitForResizeRefresh(animated: boolean): Promise<void> {
  await new Promise<void>((resolve) => globalThis.setTimeout(resolve, animated ? 280 : 100));
  await nextPaint();
}

function dispatchKey(
  target: HTMLElement,
  key: string,
  modifiers: Readonly<Partial<Pick<KeyboardEventInit, 'ctrlKey' | 'metaKey' | 'shiftKey'>>> = {},
  type: 'keydown' | 'keyup' = 'keydown',
): KeyboardEvent {
  const event = new KeyboardEvent(type, {
    bubbles: true,
    cancelable: true,
    key,
    ...modifiers,
  });
  target.dispatchEvent(event);
  return event;
}

function activeFlowItem(flow: HTMLElement | null): HTMLElement | null {
  const activeId = flow?.getAttribute('aria-activedescendant');
  return activeId === null || activeId === undefined ? null : document.getElementById(activeId);
}

function latestLiveMessage(politeness: 'assertive' | 'polite' = 'polite'): string {
  const regions: NodeListOf<HTMLElement> = document.querySelectorAll(`[aria-live="${politeness}"]`);
  return regions.length === 0 ? '' : (regions.item(regions.length - 1).textContent ?? '');
}

const protectedGraphKeys: readonly string[] = [
  'ArrowRight',
  'Delete',
  'Backspace',
  'c',
  ' ',
  'Enter',
  'Escape',
];
const performanceScenarios = [
  { name: '100 static connections', connectionCount: 100, animatedCount: 0 },
  { name: '100 animated connections', connectionCount: 100, animatedCount: 100 },
  { name: '300 static connections', connectionCount: 300, animatedCount: 0 },
  {
    name: '50 animated within a 300-connection graph',
    connectionCount: 300,
    animatedCount: 50,
  },
] as const;

describe('TngFlowEditorComponent browser contracts', () => {
  it('renders a fixed-radius background grid using its spacing, default color, and public token', async () => {
    const fixture = TestBed.createComponent(BrowserGridHost);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const fixtureRoot = fixture.nativeElement as HTMLElement;
    const editorHost = fixtureRoot.querySelector<HTMLElement>('tng-flow-editor');
    const editor = fixture.debugElement.query(
      (debugElement) => debugElement.componentInstance instanceof TngFlowEditorComponent,
    )?.componentInstance as TngFlowEditorComponent | undefined;
    if (editorHost === null || editor === undefined) {
      throw new Error('Expected the flow editor to render.');
    }
    const pattern = editorHost.querySelector<SVGPatternElement>('f-background pattern');
    const circle = editorHost.querySelector<SVGCircleElement>('f-background circle');
    if (pattern === null || circle === null) {
      throw new Error('Expected the dotted background pattern to render.');
    }

    expect(Number(pattern.getAttribute('width'))).toBeCloseTo(24);
    expect(Number(pattern.getAttribute('height'))).toBeCloseTo(24);

    const colorProbe = document.createElement('span');
    colorProbe.style.color = 'color-mix(in srgb, rgb(40, 80, 120) 26%, transparent)';
    editorHost.append(colorProbe);
    const expectedDefaultColor = getComputedStyle(colorProbe).color;
    colorProbe.remove();

    expect(getComputedStyle(circle).fill).toBe(expectedDefaultColor);

    fixture.componentInstance.gridColor.set('rgb(255, 0, 0)');
    fixture.detectChanges();
    await nextPaint();

    expect(getComputedStyle(circle).fill).toBe('rgb(255, 0, 0)');

    for (const scale of [0.18, 0.35, 1, 2]) {
      fixture.componentInstance.viewport.set({
        position: { x: 0, y: 0 },
        scale,
      });
      fixture.detectChanges();
      await fixture.whenStable();
      await nextPaint();

      expect(Number(pattern.getAttribute('width'))).toBeCloseTo(24);
      expect(Number(pattern.getAttribute('height'))).toBeCloseTo(24);
      expect(getComputedStyle(circle).getPropertyValue('r')).toBe('1px');
    }

    fixture.componentInstance.showBackground.set(false);
    fixture.detectChanges();
    await nextPaint();

    expect(editorHost.querySelector('f-background')).toBeNull();
    expect(editor.snapToGrid()).toBe(true);

    fixture.componentInstance.showBackground.set(true);
    fixture.detectChanges();
    await nextPaint();

    expect(editorHost.querySelector('f-background circle')).not.toBeNull();
  });

  it.each([
    { animated: false, resizeMode: 'immediate' },
    { animated: true, resizeMode: 'animated' },
  ])(
    'keeps custom-point and routed connections attached after $resizeMode container resizing',
    async ({ animated }) => {
      const fixture = TestBed.createComponent(BrowserResizableFlowHost);
      fixture.detectChanges();
      await fixture.whenStable();
      await nextPaint();

      const host = fixture.nativeElement as HTMLElement;
      const shell = host.querySelector<HTMLElement>('.resizable-shell');
      const canvas = host.querySelector<HTMLElement>('f-canvas');
      if (shell === null || canvas === null) {
        throw new Error('Expected the resizable flow shell and canvas to render.');
      }
      await waitForRenderedConnectionPaths(host);
      expectResizableConnectionsAttached(host);
      const initialTransform = canvas.style.transform;
      const initialViewportChangeCount = fixture.componentInstance.viewportChangeCount();
      const initialPositions = resizableFlowDefinition.nodes.map((node) => node.position);
      const initialWaypoints = resizableFlowDefinition.connections[0]?.routing?.waypoints;

      fixture.componentInstance.animated.set(animated);
      fixture.detectChanges();
      await nextPaint();
      fixture.componentInstance.collapsed.set(true);
      fixture.detectChanges();
      await waitForResizeRefresh(animated);
      await waitForRenderedConnectionPaths(host);

      expect(Math.round(shell.getBoundingClientRect().width)).toBe(700);
      expect(Math.round(shell.getBoundingClientRect().height)).toBe(480);
      expectResizableConnectionsAttached(host);

      fixture.componentInstance.collapsed.set(false);
      fixture.detectChanges();
      await waitForResizeRefresh(animated);
      await waitForRenderedConnectionPaths(host);

      expect(Math.round(shell.getBoundingClientRect().width)).toBe(1000);
      expect(Math.round(shell.getBoundingClientRect().height)).toBe(580);
      expectResizableConnectionsAttached(host);
      expect(canvas.style.transform).toBe(initialTransform);
      expect(fixture.componentInstance.viewportChangeCount()).toBe(initialViewportChangeCount);
      expect(resizableFlowDefinition.nodes.map((node) => node.position)).toEqual(initialPositions);
      expect(resizableFlowDefinition.connections[0]?.routing?.waypoints).toBe(initialWaypoints);
    },
  );

  it('previews minimap positions on hover, restores on leave, and commits clicks', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.componentRef.setInput('showControls', false);
    fixture.componentRef.setInput('showMinimap', true);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const host = fixture.nativeElement as HTMLElement;
    const viewportChanged = vi.fn<(viewport: TngFlowViewport) => void>();
    fixture.componentInstance.viewportChange.subscribe(viewportChanged);
    const canvas = host.querySelector<HTMLElement>('f-canvas');
    const minimapShell = host.querySelector<HTMLElement>('.tng-flow-editor__minimap-shell');
    const minimap = host.querySelector<HTMLElement>('f-minimap');
    const minimapView = host.querySelector<SVGRectElement>('.f-minimap-view');
    if (canvas === null || minimapShell === null || minimap === null || minimapView === null) {
      throw new Error('Expected the canvas, minimap, and viewport to render.');
    }

    expect(getComputedStyle(minimapView).pointerEvents).toBe('none');
    const bounds = minimap.getBoundingClientRect();
    minimap.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        clientX: bounds.left + bounds.width * 0.25,
        clientY: bounds.top + bounds.height * 0.5,
        pointerType: 'mouse',
      }),
    );
    await new Promise<void>((resolve) => globalThis.setTimeout(resolve, 0));
    const firstPosition = viewportChanged.mock.lastCall?.[0]?.position;

    minimap.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        clientX: bounds.left + bounds.width * 0.75,
        clientY: bounds.top + bounds.height * 0.5,
        pointerType: 'mouse',
      }),
    );
    await new Promise<void>((resolve) => globalThis.setTimeout(resolve, 0));
    const secondPosition = viewportChanged.mock.lastCall?.[0]?.position;

    if (firstPosition === undefined || secondPosition === undefined) {
      throw new Error('Expected minimap hover to emit two viewport positions.');
    }
    expect(secondPosition.x).toBeLessThan(firstPosition.x);
    expect(secondPosition.y).toBeCloseTo(firstPosition.y, 4);

    minimapShell.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }));
    expect(canvas.style.transition).toContain('transform');
    await new Promise<void>((resolve) => globalThis.setTimeout(resolve, 0));

    expect(viewportChanged.mock.lastCall?.[0]?.position).toEqual({ x: 0, y: 0 });

    minimap.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        clientX: bounds.left + bounds.width * 0.25,
        clientY: bounds.top + bounds.height * 0.5,
        pointerType: 'mouse',
      }),
    );
    expect(canvas.style.transition).toBe('');
    await new Promise<void>((resolve) => globalThis.setTimeout(resolve, 0));
    const committedPosition = viewportChanged.mock.lastCall?.[0]?.position;
    minimap.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    minimap.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        clientX: bounds.left + bounds.width * 0.75,
        clientY: bounds.top + bounds.height * 0.5,
        pointerType: 'mouse',
      }),
    );
    minimapShell.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }));
    await new Promise<void>((resolve) => globalThis.setTimeout(resolve, 0));

    expect(committedPosition).toBeDefined();
    expect(viewportChanged.mock.lastCall?.[0]?.position).toEqual(committedPosition);
  });

  it('keeps controlled minimap hover active across immutable host synchronization', async () => {
    const fixture = TestBed.createComponent(BrowserControlledMinimapHost);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const host = fixture.nativeElement as HTMLElement;
    const minimap = host.querySelector<HTMLElement>('f-minimap');
    const minimapShell = host.querySelector<HTMLElement>('.tng-flow-editor__minimap-shell');
    if (minimap === null || minimapShell === null) {
      throw new Error('Expected the controlled interactive minimap to render.');
    }
    const bounds = minimap.getBoundingClientRect();

    minimap.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        clientX: bounds.left + bounds.width * 0.25,
        clientY: bounds.top + bounds.height * 0.5,
        pointerType: 'mouse',
      }),
    );
    await fixture.whenStable();
    await nextPaint();

    const firstPosition = fixture.componentInstance.viewport().position;
    expect(firstPosition).not.toEqual({ x: 0, y: 0 });
    expect(fixture.componentInstance.viewportChangeCount()).toBe(1);

    minimap.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        clientX: bounds.left + bounds.width * 0.75,
        clientY: bounds.top + bounds.height * 0.5,
        pointerType: 'mouse',
      }),
    );
    await fixture.whenStable();
    await nextPaint();

    expect(fixture.componentInstance.viewport().position.x).toBeLessThan(firstPosition.x);
    expect(fixture.componentInstance.viewportChangeCount()).toBe(2);

    minimapShell.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }));
    await fixture.whenStable();
    await nextPaint();

    expect(fixture.componentInstance.viewport().position).toEqual({ x: 0, y: 0 });
    expect(fixture.componentInstance.viewportChangeCount()).toBe(3);
  });

  it('keeps default labels at the true midpoint of all geometries while moving and zooming', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', createConnectionGeometryDefinition());
    fixture.componentRef.setInput('selection', {
      nodeIds: new Set(connectionGeometries.map((geometry) => `${geometry}-source`)),
      connectionIds: new Set<string>(),
    });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.componentRef.setInput('showControls', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const host = fixture.nativeElement as HTMLElement;
    await waitForRenderedConnectionPaths(host);
    for (const geometry of connectionGeometries) {
      const connection = host.querySelector<HTMLElement>(
        `[data-connection-id="${geometry}-connection"]`,
      );
      if (connection === null) {
        throw new Error(`Expected the ${geometry} connection to render.`);
      }
      expectContentAtPathMidpoint(connection);
    }

    const flow = host.querySelector<HTMLElement>('f-flow');
    if (flow === null) {
      throw new Error('Expected the flow host to render.');
    }
    flow.focus();
    dispatchKey(flow, ' ');
    dispatchKey(flow, 'ArrowRight');
    await nextPaint();
    await waitForRenderedConnectionPaths(host);
    for (const geometry of connectionGeometries) {
      const connection = host.querySelector<HTMLElement>(
        `[data-connection-id="${geometry}-connection"]`,
      );
      if (connection === null) {
        throw new Error(`Expected the moving ${geometry} connection to render.`);
      }
      expectContentAtPathMidpoint(connection);
    }
    dispatchKey(flow, 'Escape');

    fixture.componentRef.setInput('definition', createConnectionGeometryDefinition(96));
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();
    await waitForRenderedConnectionPaths(host);

    for (const geometry of connectionGeometries) {
      const connection = host.querySelector<HTMLElement>(
        `[data-connection-id="${geometry}-connection"]`,
      );
      if (connection === null) {
        throw new Error(`Expected the moved ${geometry} connection to render.`);
      }
      expectContentAtPathMidpoint(connection);
    }

    fixture.componentRef.setInput('viewport', { position: { x: 24, y: 16 }, scale: 0.5 });
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();
    await waitForRenderedConnectionPaths(host);

    for (const geometry of connectionGeometries) {
      const connection = host.querySelector<HTMLElement>(
        `[data-connection-id="${geometry}-connection"]`,
      );
      if (connection === null) {
        throw new Error(`Expected the zoomed ${geometry} connection to render.`);
      }
      expectContentAtPathMidpoint(connection);
    }
  });

  it('renders every TailNG path type with resolved geometry, labels, markers, and waypoints', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', createRoutedConnectionDefinition());
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.componentRef.setInput('showControls', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const host = fixture.nativeElement as HTMLElement;
    await waitForRenderedConnectionPaths(host);
    const rendererTypes: Readonly<Record<TngFlowConnectionPathType, string>> = {
      straight: 'straight',
      bezier: 'bezier',
      orthogonal: 'segment',
      'orthogonal-rounded': 'segment',
      adaptive: 'adaptive-curve',
    };

    for (const pathType of routedConnectionTypes) {
      const connection = host.querySelector<HTMLElement>(
        `[data-connection-id="${pathType}-routing-connection"]`,
      );
      const path = connection?.querySelector<SVGPathElement>('.f-connection-path');
      expect(connection?.getAttribute('data-path-type')).toBe(pathType);
      expect(connection?.getAttribute('data-f-connection-type')).toBe(rendererTypes[pathType]);
      expect(path?.getAttribute('d')?.length).toBeGreaterThan(5);
      expect(connection?.querySelector('f-connection-marker-arrow')).not.toBeNull();
      expect(connection?.querySelector('[data-label-placement="center"]')).not.toBeNull();
    }

    const straightPath = host
      .querySelector('[data-connection-id="straight-routing-connection"] .f-connection-path')
      ?.getAttribute('d');
    const bezierPath = host
      .querySelector('[data-connection-id="bezier-routing-connection"] .f-connection-path')
      ?.getAttribute('d');
    const orthogonalPath = host
      .querySelector('[data-connection-id="orthogonal-routing-connection"] .f-connection-path')
      ?.getAttribute('d');
    const roundedPath = host
      .querySelector(
        '[data-connection-id="orthogonal-rounded-routing-connection"] .f-connection-path',
      )
      ?.getAttribute('d');

    expect(straightPath).not.toMatch(/[CQ]/u);
    expect(bezierPath).toMatch(/C/u);
    expect(orthogonalPath).not.toMatch(/[CQ]/u);
    expect(roundedPath).toMatch(/Q/u);
    expect(
      host.querySelector(
        '[data-connection-id="orthogonal-rounded-routing-connection"] f-connection-waypoints',
      ),
    ).not.toBeNull();
  });

  it('applies pulse motion and honors the programmatic reduced-motion fallback', async () => {
    const fixture = TestBed.createComponent(BrowserMotionHost);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const host = fixture.nativeElement as HTMLElement;
    await waitForRenderedConnectionPaths(host);
    const connection = host.querySelector<HTMLElement>('[data-connection-id="start-to-finish"]');
    const path = connection?.querySelector<SVGPathElement>('.f-connection-path');

    expect(connection?.getAttribute('data-motion')).toBe('pulse');
    expect(connection?.getAttribute('aria-description')).toContain('Waiting for approval');
    expect(getComputedStyle(path!).animationName).toBe('none');
    expect(getComputedStyle(path!).strokeDasharray).toBe('none');

    fixture.componentInstance.connectionOptions.set({ motionPreference: 'enabled' });
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const enabledPath = host.querySelector<SVGPathElement>(
      '[data-connection-id="start-to-finish"] .f-connection-path',
    );
    expect(host.querySelector('.tng-flow-editor')?.getAttribute('data-motion-preference')).toBe(
      'enabled',
    );
    expect(getComputedStyle(enabledPath!).animationName).toBe('tng-flow-connection-pulse');
  });

  it.each(performanceScenarios)(
    'renders $name within the large-graph budget',
    async ({ connectionCount, animatedCount }) => {
      const fixture = TestBed.createComponent(TngFlowEditorComponent);
      fixture.componentRef.setInput('definition', createPerformanceDefinition(connectionCount));
      fixture.componentRef.setInput('presentation', createPerformancePresentation(animatedCount));
      fixture.componentRef.setInput('fitOnInit', false);
      fixture.componentRef.setInput('showControls', false);

      const renderStarted = performance.now();
      fixture.detectChanges();
      await fixture.whenStable();
      const host = fixture.nativeElement as HTMLElement;
      await waitForRenderedConnectionPaths(host);
      const renderDuration = performance.now() - renderStarted;

      expect(host.querySelectorAll('[data-connection-id]')).toHaveLength(connectionCount);
      expect(host.querySelectorAll('[data-motion="flow"]')).toHaveLength(animatedCount);
      expect(renderDuration).toBeLessThan(10_000);

      const frameStarted = performance.now();
      await nextPaint();
      expect(performance.now() - frameStarted).toBeLessThan(2_500);
    },
    15_000,
  );

  it('keeps custom labels truncated, accessible, selected, and path-safe on all geometries', async () => {
    const fixture = TestBed.createComponent(BrowserConnectionTemplateHost);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const host = fixture.nativeElement as HTMLElement;
    await waitForRenderedConnectionPaths(host);
    for (const geometry of connectionGeometries) {
      const connection = host.querySelector<HTMLElement>(
        `[data-connection-id="${geometry}-connection"]`,
      );
      if (connection === null) {
        throw new Error(`Expected the custom ${geometry} connection to render.`);
      }
      const template = connection.querySelector<HTMLElement>(
        '.tng-flow-editor__connection-template',
      );
      const customLabel = template?.querySelector<HTMLElement>(
        '[data-testid="browser-custom-connection-label"]',
      );

      expect(connection.getAttribute('aria-label')).toBe(
        `${geometry} approval route with a complete accessible name that must remain available`,
      );
      expect(connection.getAttribute('aria-description')).toBe(
        `Runtime route rendered using ${geometry} geometry.`,
      );
      expect(connection.querySelectorAll('.f-connection-path')).toHaveLength(1);
      expect(customLabel?.textContent?.trim()).toBe(connection.getAttribute('aria-label'));
      expect(getComputedStyle(template!).textOverflow).toBe('ellipsis');
      expect(getComputedStyle(template!).whiteSpace).toBe('nowrap');
      expect(template!.scrollWidth).toBeGreaterThan(template!.clientWidth);
      const content = connection.querySelector<HTMLElement>('[data-connection-content]');
      expect(getComputedStyle(content!).pointerEvents).toBe('none');
      const contentBounds = content!.getBoundingClientRect();
      const hitTarget = document.elementFromPoint(
        contentBounds.left + contentBounds.width / 2,
        contentBounds.top + contentBounds.height / 2,
      );
      expect(hitTarget?.closest('f-connection')).toBe(connection);
      expectContentAtPathMidpoint(connection);
    }

    const selected = host.querySelector<HTMLElement>(
      '[data-connection-id="adaptive-curve-connection"]',
    );
    expect(selected?.classList.contains('f-selected')).toBe(true);
    const handle = selected?.querySelector<SVGCircleElement>('.f-connection-drag-handle');
    expect(handle).not.toBeNull();
    expect(getComputedStyle(handle!).pointerEvents).toBe('all');

    fixture.componentInstance.definition.set(createConnectionGeometryDefinition(72));
    fixture.componentInstance.viewport.set({ position: { x: 16, y: 24 }, scale: 2 });
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();
    await waitForRenderedConnectionPaths(host);

    for (const geometry of connectionGeometries) {
      const connection = host.querySelector<HTMLElement>(
        `[data-connection-id="${geometry}-connection"]`,
      );
      if (connection === null) {
        throw new Error(`Expected the updated custom ${geometry} connection to render.`);
      }
      expectContentAtPathMidpoint(connection);
    }
  });

  it('renders measurable nodes and a keyboard entry point from a frozen snapshot', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const host = fixture.nativeElement as HTMLElement;
    const flow = host.querySelector<HTMLElement>('f-flow');
    const start = host.querySelector<HTMLElement>('[data-node-id="start"]');
    const bounds = start?.getBoundingClientRect();

    expect(bounds?.width).toBeGreaterThan(0);
    expect(bounds?.height).toBeGreaterThan(0);
    expect(flow?.getAttribute('role')).toBe('application');
    expect(flow?.getAttribute('tabindex')).toBe('0');
    expect(definition.nodes[0].position).toEqual({ x: 40, y: 80 });
    expect(Object.isFrozen(definition.connections[0].source)).toBe(true);
  });

  it('delegates spatial, topology, and extended-selection navigation to withA11y()', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const selections: {
      nodeIds: ReadonlySet<string>;
      connectionIds: ReadonlySet<string>;
    }[] = [];
    fixture.componentInstance.selectionChange.subscribe((selection) => selections.push(selection));
    const flow = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('f-flow');
    if (flow === null) {
      throw new Error('Expected the flow host to render.');
    }
    flow.focus();

    dispatchKey(flow, 'Home');
    expect(activeFlowItem(flow)?.dataset['nodeId']).toBe('start');
    dispatchKey(flow, 'ArrowRight', { shiftKey: true });
    expect(activeFlowItem(flow)?.dataset['connectionId']).toBe('start-to-finish');
    expect([...selections.at(-1)!.nodeIds]).toContain('start');
    expect([...selections.at(-1)!.connectionIds]).toContain('start-to-finish');

    dispatchKey(flow, 'Home');
    dispatchKey(flow, 'ArrowRight', { ctrlKey: true });
    expect(activeFlowItem(flow)?.dataset['connectionId']).toBe('start-to-finish');
    dispatchKey(flow, 'ArrowRight', { ctrlKey: true });
    expect(activeFlowItem(flow)?.dataset['nodeId']).toBe('finish');

    dispatchKey(flow, 'Home');
    dispatchKey(flow, 'ArrowRight', { metaKey: true });
    expect(activeFlowItem(flow)?.dataset['connectionId']).toBe('start-to-finish');
    expect(latestLiveMessage()).toContain('Connection');
  });

  it('anchors paste and duplicate requests to the last pointer position under pan and zoom', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('viewport', {
      position: { x: 120, y: -40 },
      scale: 1.5,
    });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const requested: TngFlowEditorCommandRequest[] = [];
    fixture.componentInstance.commandRequested.subscribe((request) => requested.push(request));
    const flow = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('f-flow');
    if (flow === null) {
      throw new Error('Expected the flow host to render.');
    }
    const bounds = flow.getBoundingClientRect();
    const clientPosition = {
      x: bounds.left + bounds.width * 0.72,
      y: bounds.top + bounds.height * 0.38,
    };
    flow.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        clientX: clientPosition.x,
        clientY: clientPosition.y,
      }),
    );

    expect(fixture.componentInstance.requestCommand('paste')).toBe(true);
    expect(fixture.componentInstance.requestCommand('duplicate')).toBe(true);
    const expected = fixture.componentInstance.screenToCanvas(clientPosition);
    expect(requested.map((request) => request.canvasPosition)).toEqual([expected, expected]);
  });

  it('reports pointer context targets with client and transformed canvas coordinates', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('contextMenuEnabled', true);
    fixture.componentRef.setInput('viewport', {
      position: { x: -90, y: 35 },
      scale: 1.4,
    });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const requested: TngFlowContextMenuRequest[] = [];
    fixture.componentInstance.contextMenuRequested.subscribe((request) => requested.push(request));
    const start = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[data-node-id="start"]',
    );
    if (start === null) {
      throw new Error('Expected the start node to render.');
    }
    const bounds = start.getBoundingClientRect();
    const clientPosition = {
      x: bounds.left + bounds.width / 2,
      y: bounds.top + bounds.height / 2,
    };
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: clientPosition.x,
      clientY: clientPosition.y,
    });
    start.dispatchEvent(event);
    const dispatchedClientPosition = { x: event.clientX, y: event.clientY };

    expect(event.defaultPrevented).toBe(true);
    expect(requested).toHaveLength(1);
    expect(requested[0]).toEqual({
      target: { kind: 'node', nodeId: 'start' },
      source: 'pointer',
      clientPosition: dispatchedClientPosition,
      canvasPosition: fixture.componentInstance.screenToCanvas(dispatchedClientPosition),
      selection: {
        nodeIds: new Set(['start']),
        connectionIds: new Set(),
      },
    });
  });

  it('anchors keyboard context menus to the active graph item and then the viewport centre', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('contextMenuEnabled', true);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const requested: TngFlowContextMenuRequest[] = [];
    fixture.componentInstance.contextMenuRequested.subscribe((request) => requested.push(request));
    const host = fixture.nativeElement as HTMLElement;
    const flow = host.querySelector<HTMLElement>('f-flow');
    if (flow === null) {
      throw new Error('Expected the flow host to render.');
    }
    flow.focus();
    dispatchKey(flow, 'Home');
    const active = activeFlowItem(flow);
    if (active === null) {
      throw new Error('Expected keyboard navigation to activate a graph item.');
    }
    const activeBounds = active.getBoundingClientRect();
    const activeEvent = dispatchKey(flow, 'ContextMenu');

    expect(activeEvent.defaultPrevented).toBe(true);
    expect(requested[0]).toEqual(
      expect.objectContaining({
        target: { kind: 'node', nodeId: 'start' },
        source: 'keyboard',
        clientPosition: {
          x: activeBounds.left + activeBounds.width / 2,
          y: activeBounds.top + activeBounds.height / 2,
        },
      }),
    );

    dispatchKey(flow, 'ArrowRight');
    const activeConnection = activeFlowItem(flow);
    if (activeConnection === null) {
      throw new Error('Expected keyboard navigation to activate a connection.');
    }
    const connectionBounds = activeConnection.getBoundingClientRect();
    dispatchKey(flow, 'ContextMenu');
    expect(requested[1]).toEqual(
      expect.objectContaining({
        target: { kind: 'connection', connectionId: 'start-to-finish' },
        source: 'keyboard',
        clientPosition: {
          x: connectionBounds.left + connectionBounds.width / 2,
          y: connectionBounds.top + connectionBounds.height / 2,
        },
      }),
    );

    flow.removeAttribute('aria-activedescendant');
    const flowBounds = flow.getBoundingClientRect();
    const fallbackEvent = dispatchKey(flow, 'F10', { shiftKey: true });
    expect(fallbackEvent.defaultPrevented).toBe(true);
    expect(requested[2]).toEqual(
      expect.objectContaining({
        target: { kind: 'canvas' },
        source: 'keyboard',
        clientPosition: {
          x: flowBounds.left + flowBounds.width / 2,
          y: flowBounds.top + flowBounds.height / 2,
        },
      }),
    );
  });

  it('uses coarse grabbed movement and cancels without emitting a controlled move', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('selection', {
      nodeIds: new Set(['start']),
      connectionIds: new Set(),
    });
    fixture.componentRef.setInput('keyboardOptions', { moveStep: 4, largeMoveStep: 40 });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const moved = vi.fn();
    fixture.componentInstance.nodesMoved.subscribe(moved);
    const flow = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('f-flow');
    if (flow === null) {
      throw new Error('Expected the flow host to render.');
    }
    flow.focus();
    dispatchKey(flow, ' ');
    dispatchKey(flow, 'ArrowDown', { shiftKey: true });
    expect(latestLiveMessage()).toContain('120');
    dispatchKey(flow, 'Escape');
    await fixture.whenStable();

    expect(moved).not.toHaveBeenCalled();
    expect(latestLiveMessage()).toContain('returned to original position');
  });

  it.each(['Delete', 'Backspace'])(
    '%s emits a controlled deletion request without mutating data',
    async (key) => {
      const fixture = TestBed.createComponent(TngFlowEditorComponent);
      fixture.componentRef.setInput('definition', multiNodeDefinition);
      fixture.componentRef.setInput('selection', {
        nodeIds: new Set(['start', 'locked']),
        connectionIds: new Set(),
      });
      fixture.componentRef.setInput('fitOnInit', false);
      fixture.detectChanges();
      await fixture.whenStable();
      await nextPaint();

      const deleted = vi.fn();
      fixture.componentInstance.nodesDeleteRequested.subscribe(deleted);
      const flow = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('f-flow');
      if (flow === null) {
        throw new Error('Expected the flow host to render.');
      }
      flow.focus();
      dispatchKey(flow, key);
      await fixture.whenStable();

      expect(deleted).toHaveBeenCalledOnce();
      expect(deleted).toHaveBeenCalledWith({ nodeIds: ['start'], source: 'keyboard' });
      expect(multiNodeDefinition.nodes).toHaveLength(4);
      expect(latestLiveMessage('assertive')).toContain('Delete requested');
    },
  );

  it('Delete removes a selected node and its incident connections after the controlled update', async () => {
    const nodeId = 'start';
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const deleted = vi.fn();
    fixture.componentInstance.nodesDeleteRequested.subscribe(deleted);
    const host = fixture.nativeElement as HTMLElement;
    const flow = host.querySelector<HTMLElement>('f-flow');
    if (flow === null) {
      throw new Error('Expected the flow host to render.');
    }
    expect(host.querySelector(`[data-node-id="${nodeId}"]`)).not.toBeNull();
    expect(host.querySelector('[data-connection-id="start-to-finish"]')).not.toBeNull();

    fixture.componentRef.setInput('selection', {
      nodeIds: new Set([nodeId]),
      connectionIds: new Set<string>(),
    });
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();
    expect(
      host
        .querySelector(`[data-node-id="${nodeId}"]`)
        ?.classList.contains('tng-flow-editor__node--selected'),
    ).toBe(true);

    flow.focus();
    dispatchKey(flow, 'Delete');
    await fixture.whenStable();

    expect(deleted).toHaveBeenCalledOnce();
    expect(deleted).toHaveBeenCalledWith({ nodeIds: [nodeId], source: 'keyboard' });

    fixture.componentRef.setInput('definition', {
      ...definition,
      nodes: definition.nodes.filter((node) => node.id !== nodeId),
      connections: definition.connections.filter(
        (connection) => connection.source.nodeId !== nodeId && connection.target.nodeId !== nodeId,
      ),
    });
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    expect(host.querySelector(`[data-node-id="${nodeId}"]`)).toBeNull();
    expect(host.querySelector('[data-connection-id="start-to-finish"]')).toBeNull();
  });

  it.each(connectionGeometries)(
    'Delete removes a selected %s connection after the controlled update',
    async (geometry) => {
      const connectionId = `${geometry}-connection`;
      const connectionDefinition = createConnectionGeometryDefinition();
      const fixture = TestBed.createComponent(TngFlowEditorComponent);
      fixture.componentRef.setInput('definition', connectionDefinition);
      fixture.componentRef.setInput('fitOnInit', false);
      fixture.detectChanges();
      await fixture.whenStable();
      await nextPaint();

      const deleted = vi.fn();
      fixture.componentInstance.connectionsDeleteRequested.subscribe(deleted);
      const host = fixture.nativeElement as HTMLElement;
      const flow = host.querySelector<HTMLElement>('f-flow');
      if (flow === null) {
        throw new Error('Expected the flow host to render.');
      }
      expect(host.querySelector(`[data-connection-id="${connectionId}"]`)).not.toBeNull();
      await waitForRenderedConnectionPaths(host);

      fixture.componentRef.setInput('selection', {
        nodeIds: new Set<string>(),
        connectionIds: new Set([connectionId]),
      });
      fixture.detectChanges();
      await fixture.whenStable();
      await nextPaint();
      expect(
        host.querySelector(`[data-connection-id="${connectionId}"]`)?.hasAttribute('data-selected'),
      ).toBe(true);

      flow.focus();
      dispatchKey(flow, 'Delete');
      await fixture.whenStable();

      expect(deleted).toHaveBeenCalledOnce();
      expect(deleted).toHaveBeenCalledWith({
        connectionIds: [connectionId],
        source: 'keyboard',
      });

      fixture.componentRef.setInput('definition', {
        ...connectionDefinition,
        connections: connectionDefinition.connections.filter(
          (connection) => connection.id !== connectionId,
        ),
      });
      fixture.detectChanges();
      await fixture.whenStable();
      await nextPaint();

      expect(host.querySelector(`[data-connection-id="${connectionId}"]`)).toBeNull();
    },
  );

  it('measures rendered geometry and emits one controlled layout request', async () => {
    let measuredGraph: TngFlowLayoutGraph | undefined;
    const calculate = vi.fn<TngFlowLayoutEngine['calculate']>((graph) => {
      measuredGraph = graph;
      return Promise.resolve([
        { id: 'finish', position: { x: 520, y: 96 } },
        { id: 'start', position: { x: 40, y: 80 } },
      ]);
    });
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.componentRef.setInput('layoutEngine', { calculate });
    const ready = new Promise<void>((resolveReady) => {
      fixture.componentInstance.ready.subscribe(() => resolveReady());
    });
    fixture.detectChanges();
    await fixture.whenStable();
    await ready;
    await nextPaint();
    const finish = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[data-node-id="finish"]',
    );
    if (finish !== null) {
      finish.style.width = '420px';
    }
    await nextPaint();
    const requested = vi.fn<(event: TngFlowNodesLayoutRequest) => void>();
    fixture.componentInstance.nodesLayoutRequested.subscribe(requested);
    const fitToScreen = vi.spyOn(fixture.componentInstance, 'fitToScreen');

    const accepted = await fixture.componentInstance.requestAutoLayout({
      direction: 'top-to-bottom',
      viewport: { fit: true, animated: false, padding: 32 },
    });

    expect(accepted).toBe(true);
    expect(calculate).toHaveBeenCalledOnce();
    expect(measuredGraph?.nodes.map((entry) => entry.node.id)).toEqual(['finish', 'start']);
    expect(measuredGraph?.nodes[0].bounds.size.width).toBeGreaterThan(400);
    expect(measuredGraph?.nodes.every((entry) => entry.bounds.size.height > 0)).toBe(true);
    expect(requested).toHaveBeenCalledOnce();
    expect(requested).toHaveBeenCalledWith({
      nodes: [{ id: 'finish', position: { x: 520, y: 96 } }],
      options: {
        direction: 'top-to-bottom',
        nodeSpacing: 48,
        levelSpacing: 120,
        componentSpacing: 64,
        preserveLockedNodes: true,
        includeDisconnectedNodes: true,
      },
      viewport: { fit: true, animated: false, padding: 32 },
      source: 'api',
    });
    expect(fitToScreen).not.toHaveBeenCalled();

    fixture.componentRef.setInput('definition', {
      ...definition,
      nodes: definition.nodes.map((node) =>
        node.id === 'finish' ? { ...node, position: { x: 520, y: 96 } } : node,
      ),
    });
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    expect(fitToScreen).toHaveBeenCalledWith(false, 32);
    expect(definition.nodes[1].position).toEqual({ x: 440, y: 80 });
  });

  it.each([0.35, 1, 2])(
    'measures custom bounds and emits one controlled alignment request at zoom %s',
    async (scale) => {
      const fixture = TestBed.createComponent(TngFlowEditorComponent);
      fixture.componentRef.setInput('definition', definition);
      fixture.componentRef.setInput('selection', {
        nodeIds: new Set(['start', 'finish']),
        connectionIds: new Set<string>(),
      });
      fixture.componentRef.setInput('viewport', { position: { x: 0, y: 0 }, scale });
      fixture.componentRef.setInput('fitOnInit', false);
      const ready = new Promise<void>((resolveReady) => {
        fixture.componentInstance.ready.subscribe(() => resolveReady());
      });
      fixture.detectChanges();
      await fixture.whenStable();
      await ready;
      await nextPaint();

      const host = fixture.nativeElement as HTMLElement;
      const start = host.querySelector<HTMLElement>('[data-node-id="start"]');
      const finish = host.querySelector<HTMLElement>('[data-node-id="finish"]');
      if (start === null || finish === null) {
        throw new Error('Expected both alignment nodes to render.');
      }
      finish.style.width = '420px';
      await nextPaint();

      const startWidth = start.getBoundingClientRect().width / scale;
      const finishWidth = finish.getBoundingClientRect().width / scale;
      const targetCenter = (40 + Math.max(40 + startWidth, 440 + finishWidth)) / 2;
      const expected = [
        {
          id: 'finish',
          position: {
            x: Math.round((targetCenter - finishWidth / 2) * 1000) / 1000,
            y: 80,
          },
        },
        {
          id: 'start',
          position: {
            x: Math.round((targetCenter - startWidth / 2) * 1000) / 1000,
            y: 80,
          },
        },
      ];
      const requested = vi.fn<(event: TngFlowNodesArrangementRequest) => void>();
      fixture.componentInstance.nodesArrangementRequested.subscribe(requested);

      const accepted = fixture.componentInstance.requestNodeAlignment(
        'horizontal-center',
        {},
        'controls',
      );

      expect(accepted).toBe(true);
      expect(requested).toHaveBeenCalledOnce();
      expect(requested).toHaveBeenCalledWith({
        nodes: expected,
        operation: { kind: 'align', alignment: 'horizontal-center' },
        source: 'controls',
      });
      expect(definition.nodes[0].position).toEqual({ x: 40, y: 80 });
      expect(definition.nodes[1].position).toEqual({ x: 440, y: 80 });
    },
  );

  it('suppresses smart guides for the initiating modifier and keeps selected locks anchored', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', multiNodeDefinition);
    fixture.componentRef.setInput('selection', {
      nodeIds: new Set(['start', 'locked']),
      connectionIds: new Set<string>(),
    });
    fixture.componentRef.setInput('smartGuides', {
      enabled: true,
      alignmentThreshold: 12,
      spacingThreshold: 18,
      disableModifier: 'alt',
    });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const host = fixture.nativeElement as HTMLElement;
    const handle = host.querySelector<HTMLElement>(
      '[data-node-id="start"] .tng-flow-editor__drag-handle',
    );
    const locked = host.querySelector<HTMLElement>('[data-node-id="locked"]');
    expect(host.querySelector('f-magnetic-lines')).not.toBeNull();
    expect(host.querySelector('f-magnetic-rects')).not.toBeNull();
    expect(locked?.classList.contains('f-selected')).toBe(false);
    expect(locked?.classList.contains('tng-flow-editor__node--selected')).toBe(true);

    handle?.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        button: 0,
        buttons: 1,
        altKey: true,
      }),
    );
    expect(host.querySelector('f-magnetic-lines')).toBeNull();
    expect(host.querySelector('f-magnetic-rects')).toBeNull();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.querySelector('f-magnetic-lines')).toBeNull();
    expect(host.querySelector('f-magnetic-rects')).toBeNull();
    expect(locked?.classList.contains('f-selected')).toBe(false);
    expect(locked?.classList.contains('tng-flow-editor__node--selected')).toBe(true);

    document.dispatchEvent(
      new PointerEvent('pointerup', {
        bubbles: true,
        button: 0,
      }),
    );
    await fixture.whenStable();
    fixture.detectChanges();
    await nextPaint();

    expect(host.querySelector('f-magnetic-lines')).not.toBeNull();
    expect(host.querySelector('f-magnetic-rects')).not.toBeNull();
    expect(locked?.classList.contains('f-selected')).toBe(false);
    expect(locked?.classList.contains('tng-flow-editor__node--selected')).toBe(true);
  });

  it('moves a grabbed selection by one shared snapped delta and filters locked nodes', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', multiNodeDefinition);
    fixture.componentRef.setInput('selection', {
      nodeIds: new Set(['start', 'finish', 'locked']),
      connectionIds: new Set(),
    });
    fixture.componentRef.setInput('snapToGrid', true);
    fixture.componentRef.setInput('gridSize', 16);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const moved = vi.fn();
    fixture.componentInstance.nodesMoved.subscribe(moved);
    const flow = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('f-flow');
    flow?.focus();
    if (flow === null) {
      throw new Error('Expected the flow host to render.');
    }
    dispatchKey(flow, ' ');
    dispatchKey(flow, 'ArrowRight');
    dispatchKey(flow, ' ', {}, 'keyup');
    await fixture.whenStable();

    expect(moved).toHaveBeenCalledOnce();
    expect(moved).toHaveBeenCalledWith({
      nodes: [
        { id: 'start', position: { x: 64, y: 80 } },
        { id: 'finish', position: { x: 464, y: 80 } },
      ],
    });
    const movedNodes = moved.mock.calls[0]?.[0].nodes as readonly Readonly<{
      id: string;
      position: Readonly<{ x: number; y: number }>;
    }>[];
    expect(movedNodes[1].position.x - movedNodes[0].position.x).toBe(400);
    expect(definition.nodes[0].position).toEqual({ x: 40, y: 80 });
  });

  it('authors a validated controlled connection from a focused output port', async () => {
    const connectionlessDefinition: TngFlowDefinition = Object.freeze({
      ...definition,
      connections: Object.freeze([]),
    });
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', connectionlessDefinition);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const requested = vi.fn();
    fixture.componentInstance.connectionCreateRequested.subscribe(requested);
    const host = fixture.nativeElement as HTMLElement;
    const source = host.querySelector<HTMLElement>('[aria-label^="Start, output port"]');
    const target = host.querySelector<HTMLElement>('[aria-label^="Finish, input port"]');
    source?.focus();
    source?.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter' }),
    );
    await fixture.whenStable();

    expect(source?.hasAttribute('data-keyboard-connection-source')).toBe(true);
    expect(target?.hasAttribute('data-keyboard-connection-target')).toBe(true);
    expect(document.activeElement).toBe(target);

    target?.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: ' ' }),
    );
    await fixture.whenStable();

    expect(requested).toHaveBeenCalledOnce();
    expect(requested).toHaveBeenCalledWith({
      source: { nodeId: 'start', portId: 'next' },
      target: { nodeId: 'finish', portId: 'previous' },
    });
    expect(connectionlessDefinition.connections).toEqual([]);
  });

  it('chooses an explicit source and traverses only validator-compatible target ports', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', multiPortDefinition);
    fixture.componentRef.setInput('selection', {
      nodeIds: new Set(['source']),
      connectionIds: new Set(),
    });
    fixture.componentRef.setInput('connectionValidator', (candidate: TngFlowConnectionCandidate) =>
      candidate.target.portId === 'rejected-input'
        ? { valid: false, code: 'consumer-rejected', reason: 'Use the approved data input.' }
        : { valid: true },
    );
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const requested = vi.fn();
    fixture.componentInstance.connectionCreateRequested.subscribe(requested);
    const host = fixture.nativeElement as HTMLElement;
    const flow = host.querySelector<HTMLElement>('f-flow');
    if (flow === null) {
      throw new Error('Expected the flow host to render.');
    }
    flow.focus();
    dispatchKey(flow, 'c');
    await fixture.whenStable();

    const firstSource = document.activeElement as HTMLElement;
    expect(firstSource.getAttribute('aria-label')).toContain('output port Control');
    expect(latestLiveMessage()).toContain('source 1 of 2');
    dispatchKey(firstSource, 'ArrowDown');
    await fixture.whenStable();

    const dataSource = document.activeElement as HTMLElement;
    expect(dataSource.getAttribute('aria-label')).toContain('output port Data');
    dispatchKey(dataSource, 'Enter');
    await fixture.whenStable();

    const target = document.activeElement as HTMLElement;
    expect(target.getAttribute('aria-label')).toContain('input port Data input');
    expect(target.getAttribute('aria-label')).not.toContain('Rejected input');
    expect(
      host.querySelector('[aria-label*="Disabled input"]')?.getAttribute('aria-disabled'),
    ).toBe('true');
    expect(host.querySelector('[aria-label*="Locked input"]')?.getAttribute('aria-disabled')).toBe(
      'true',
    );
    dispatchKey(target, ' ');
    await fixture.whenStable();

    expect(requested).toHaveBeenCalledOnce();
    expect(requested).toHaveBeenCalledWith({
      source: { nodeId: 'source', portId: 'data-output' },
      target: { nodeId: 'data-target', portId: 'data-input' },
    });
    expect(latestLiveMessage()).toContain('Connection requested from Source output port Data');
    expect(multiPortDefinition.connections).toEqual([]);
  });

  it('cancels port authoring with Escape and restores focus to the source port', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', multiPortDefinition);
    fixture.componentRef.setInput('selection', {
      nodeIds: new Set(['source']),
      connectionIds: new Set(),
    });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const flow = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('f-flow');
    if (flow === null) {
      throw new Error('Expected the flow host to render.');
    }
    flow.focus();
    dispatchKey(flow, 'c');
    await fixture.whenStable();
    const source = document.activeElement as HTMLElement;
    dispatchKey(source, 'Enter');
    await fixture.whenStable();
    const target = document.activeElement as HTMLElement;
    dispatchKey(target, 'Escape');
    await fixture.whenStable();

    expect(document.activeElement).toBe(source);
    expect(latestLiveMessage()).toBe('Connection cancelled');
  });

  it('announces when the chosen source has no validator-compatible target', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', multiPortDefinition);
    fixture.componentRef.setInput('selection', {
      nodeIds: new Set(['source']),
      connectionIds: new Set(),
    });
    fixture.componentRef.setInput('connectionValidator', () => ({
      valid: false,
      code: 'consumer-rejected',
      reason: 'No destination is currently approved.',
    }));
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const flow = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('f-flow');
    if (flow === null) {
      throw new Error('Expected the flow host to render.');
    }
    flow.focus();
    dispatchKey(flow, 'c');
    await fixture.whenStable();
    const firstSource = document.activeElement as HTMLElement;
    dispatchKey(firstSource, 'ArrowDown');
    await fixture.whenStable();
    dispatchKey(document.activeElement as HTMLElement, 'Enter');
    await fixture.whenStable();

    expect(latestLiveMessage('assertive')).toContain('No compatible connection target');
    expect((document.activeElement as HTMLElement).getAttribute('aria-label')).toContain(
      'output port Data',
    );
  });

  it('recovers virtual focus to the editor after its controlled target is removed', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const flow = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('f-flow');
    flow?.focus();
    flow?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Home' }));
    const activeId = flow?.getAttribute('aria-activedescendant');
    expect(activeId).not.toBeNull();
    expect(activeId === null ? null : document.getElementById(activeId)).not.toBeNull();

    fixture.componentRef.setInput('definition', {
      ...definition,
      nodes: [definition.nodes[1]],
      connections: [],
    });
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    expect(flow?.hasAttribute('aria-activedescendant')).toBe(false);
    expect(document.activeElement).toBe(flow);
  });

  it('preserves logical focus when a controlled update keeps the same stable node id', async () => {
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', definition);
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const flow = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('f-flow');
    if (flow === null) {
      throw new Error('Expected the flow host to render.');
    }
    flow.focus();
    dispatchKey(flow, 'Home');
    const activeId = flow.getAttribute('aria-activedescendant');

    fixture.componentRef.setInput('definition', {
      ...definition,
      nodes: definition.nodes.map((node) =>
        node.id === 'start' ? { ...node, position: { x: 88, y: 112 } } : node,
      ),
    });
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    expect(flow.getAttribute('aria-activedescendant')).toBe(activeId);
    expect(activeFlowItem(flow)?.dataset['nodeId']).toBe('start');
    expect(document.activeElement).toBe(flow);
  });

  it('cancels port traversal and returns focus to the editor when a controlled update removes it', async () => {
    const connectionlessDefinition: TngFlowDefinition = {
      ...definition,
      connections: [],
    };
    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', connectionlessDefinition);
    fixture.componentRef.setInput('selection', {
      nodeIds: new Set(['start']),
      connectionIds: new Set(),
    });
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const host = fixture.nativeElement as HTMLElement;
    const flow = host.querySelector<HTMLElement>('f-flow');
    if (flow === null) {
      throw new Error('Expected the flow host to render.');
    }
    flow.focus();
    dispatchKey(flow, 'c');
    await fixture.whenStable();
    expect((document.activeElement as HTMLElement).getAttribute('aria-label')).toContain(
      'Finish, input port',
    );

    fixture.componentRef.setInput('definition', {
      ...connectionlessDefinition,
      nodes: [connectionlessDefinition.nodes[0]],
    });
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    expect(document.activeElement).toBe(flow);
    expect(latestLiveMessage()).toBe('Connection cancelled');
  });

  it.each([0.35, 1, 2])(
    'keeps node and port focus indicators visible at zoom %s',
    async (scale) => {
      const connectionlessDefinition: TngFlowDefinition = {
        ...definition,
        connections: [],
      };
      const fixture = TestBed.createComponent(TngFlowEditorComponent);
      fixture.componentRef.setInput('definition', connectionlessDefinition);
      fixture.componentRef.setInput('selection', {
        nodeIds: new Set(['start']),
        connectionIds: new Set(),
      });
      fixture.componentRef.setInput('viewport', { position: { x: 0, y: 0 }, scale });
      fixture.componentRef.setInput('fitOnInit', false);
      fixture.detectChanges();
      await fixture.whenStable();
      await nextPaint();

      const host = fixture.nativeElement as HTMLElement;
      const flow = host.querySelector<HTMLElement>('f-flow');
      if (flow === null) {
        throw new Error('Expected the flow host to render.');
      }
      flow.focus();
      dispatchKey(flow, 'Home');
      const nodeContent = host.querySelector<HTMLElement>(
        '[data-node-id="start"] .tng-flow-editor__node-content',
      );
      expect(nodeContent).not.toBeNull();
      expect(
        maxBoxShadowSpread(getComputedStyle(nodeContent!).boxShadow) * scale,
      ).toBeGreaterThanOrEqual(1.95);

      dispatchKey(flow, 'c');
      await fixture.whenStable();
      const target = document.activeElement as HTMLElement;
      const targetStyle = getComputedStyle(target);
      expect(targetStyle.outlineStyle).toBe('solid');
      expect(Number.parseFloat(targetStyle.outlineWidth) * scale).toBeGreaterThanOrEqual(2);
    },
  );

  it('does not intercept graph shortcuts from a custom node form control', async () => {
    const fixture = TestBed.createComponent(BrowserFormControlHost);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const controls: NodeListOf<HTMLElement> = (
      fixture.nativeElement as HTMLElement
    ).querySelectorAll<HTMLElement>(
      'input, textarea, select, button, a[href], summary, [contenteditable="true"], [role="switch"]',
    );
    expect(controls.length).toBeGreaterThanOrEqual(8);
    for (let index = 0; index < controls.length; index += 1) {
      const control = controls.item(index);
      control.focus();
      for (const key of protectedGraphKeys) {
        expect(dispatchKey(control, key).defaultPrevented).toBe(false);
      }
      expect(dispatchKey(control, 'ArrowRight', { ctrlKey: true }).defaultPrevented).toBe(false);
      expect(dispatchKey(control, 'c', { metaKey: true }).defaultPrevented).toBe(false);
      expect(
        control.dispatchEvent(
          new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            clientX: 20,
            clientY: 30,
          }),
        ),
      ).toBe(true);
      expect(document.activeElement).toBe(control);
    }
  });

  it('attaches nearest-border connections to facing sides with distinct multi-edge sockets', async () => {
    const nearestBorderDefinition: TngFlowDefinition = Object.freeze({
      id: 'nearest-border-browser',
      nodes: Object.freeze([
        Object.freeze({
          id: 'source',
          type: 'step',
          name: 'Source',
          position: Object.freeze({ x: 40, y: 120 }),
          ports: Object.freeze([
            Object.freeze({ id: 'out-a', direction: 'output', kind: 'data' }),
            Object.freeze({ id: 'out-b', direction: 'output', kind: 'data' }),
          ]),
        }),
        Object.freeze({
          id: 'target',
          type: 'step',
          name: 'Target',
          position: Object.freeze({ x: 440, y: 120 }),
          ports: Object.freeze([
            Object.freeze({ id: 'in-a', direction: 'input', kind: 'data' }),
            Object.freeze({ id: 'in-b', direction: 'input', kind: 'data' }),
          ]),
        }),
      ]),
      connections: Object.freeze([
        Object.freeze({
          id: 'edge-a',
          source: Object.freeze({ nodeId: 'source', portId: 'out-a' }),
          target: Object.freeze({ nodeId: 'target', portId: 'in-a' }),
          type: 'bezier' as TngFlowConnectionType,
        }),
        Object.freeze({
          id: 'edge-b',
          source: Object.freeze({ nodeId: 'source', portId: 'out-b' }),
          target: Object.freeze({ nodeId: 'target', portId: 'in-b' }),
          type: 'bezier' as TngFlowConnectionType,
        }),
      ]),
    });

    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', nearestBorderDefinition);
    fixture.componentRef.setInput('attachmentLayout', 'nearest-border');
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.componentRef.setInput('showControls', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const host = fixture.nativeElement as HTMLElement;
    await waitForRenderedConnectionPaths(host);

    const sourcePorts = host.querySelectorAll<HTMLElement>(
      '[data-node-id="source"] > [data-side="right"]',
    );
    const targetPorts = host.querySelectorAll<HTMLElement>(
      '[data-node-id="target"] > [data-side="left"]',
    );
    expect(sourcePorts).toHaveLength(2);
    expect(targetPorts).toHaveLength(2);
    expect(sourcePorts[0].style.top).not.toBe(sourcePorts[1].style.top);
    expect(host.querySelector('.tng-flow-port__label')).toBeNull();
    expect(
      host.querySelectorAll('marker[id*="f-connection-marker-"]').length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      host.querySelector(
        'path.f-connection-path[marker-start], path.f-connection-path[marker-end]',
      ) ?? host.querySelector('[marker-start], [marker-end]'),
    ).not.toBeNull();

    const editor = fixture.componentInstance as unknown as {
      onMoveNodes: (event: {
        nodes: readonly Readonly<{ id: string; position: { x: number; y: number } }>[];
      }) => void;
    };
    editor.onMoveNodes({
      nodes: [{ id: 'target', position: { x: 40, y: 420 } }],
    });
    fixture.detectChanges();
    await nextPaint();
    await waitForRenderedConnectionPaths(host);

    expect(
      host.querySelectorAll<HTMLElement>('[data-node-id="source"] > [data-side="bottom"]').length,
    ).toBe(2);
    expect(
      host.querySelectorAll<HTMLElement>('[data-node-id="target"] > [data-side="top"]').length,
    ).toBe(2);
  });

  it('renders custom-points connections with fixed sides and arrow markers', async () => {
    const customPointsDefinition: TngFlowDefinition = Object.freeze({
      id: 'custom-points-browser',
      nodes: Object.freeze([
        Object.freeze({
          id: 'source',
          type: 'step',
          name: 'Source',
          position: Object.freeze({ x: 40, y: 120 }),
          ports: Object.freeze([
            Object.freeze({
              id: 'custom-point-out-right-1',
              direction: 'output',
              kind: 'data',
              side: 'right',
            }),
          ]),
        }),
        Object.freeze({
          id: 'target',
          type: 'step',
          name: 'Target',
          position: Object.freeze({ x: 440, y: 120 }),
          ports: Object.freeze([
            Object.freeze({
              id: 'custom-point-in-left-1',
              direction: 'input',
              kind: 'data',
              side: 'left',
            }),
          ]),
        }),
      ]),
      connections: Object.freeze([
        Object.freeze({
          id: 'edge',
          source: Object.freeze({
            nodeId: 'source',
            portId: 'custom-point-out-right-1',
          }),
          target: Object.freeze({
            nodeId: 'target',
            portId: 'custom-point-in-left-1',
          }),
          type: 'bezier' as TngFlowConnectionType,
        }),
      ]),
    });

    const fixture = TestBed.createComponent(TngFlowEditorComponent);
    fixture.componentRef.setInput('definition', customPointsDefinition);
    fixture.componentRef.setInput('attachmentLayout', 'custom-points');
    fixture.componentRef.setInput('fitOnInit', false);
    fixture.componentRef.setInput('showControls', false);
    fixture.detectChanges();
    await fixture.whenStable();
    await nextPaint();

    const host = fixture.nativeElement as HTMLElement;
    await waitForRenderedConnectionPaths(host);

    const sourcePort = host.querySelector<HTMLElement>(
      '[data-node-id="source"] > [data-port-id="custom-point-out-right-1"]',
    );
    const targetPort = host.querySelector<HTMLElement>(
      '[data-node-id="target"] > [data-port-id="custom-point-in-left-1"]',
    );
    expect(sourcePort?.getAttribute('data-side')).toBe('right');
    expect(targetPort?.getAttribute('data-side')).toBe('left');
    expect(sourcePort?.hasAttribute('data-custom-point-connected')).toBe(true);
    expect(targetPort?.hasAttribute('data-custom-point-connected')).toBe(true);
    expect(host.querySelector('.tng-flow-port__label')).toBeNull();
    expect(
      host.querySelectorAll('marker[id*="f-connection-marker-"]').length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      host.querySelector(
        'path.f-connection-path[marker-start], path.f-connection-path[marker-end]',
      ) ?? host.querySelector('[marker-start], [marker-end]'),
    ).not.toBeNull();

    const editor = fixture.componentInstance as unknown as {
      onMoveNodes: (event: {
        nodes: readonly Readonly<{ id: string; position: { x: number; y: number } }>[];
      }) => void;
    };
    editor.onMoveNodes({
      nodes: [{ id: 'source', position: { x: 40, y: 420 } }],
    });
    fixture.detectChanges();
    await nextPaint();
    await waitForRenderedConnectionPaths(host);

    expect(
      host
        .querySelector<HTMLElement>(
          '[data-node-id="source"] > [data-port-id="custom-point-out-right-1"]',
        )
        ?.getAttribute('data-side'),
    ).toBe('right');
    expect(
      host
        .querySelector<HTMLElement>(
          '[data-node-id="target"] > [data-port-id="custom-point-in-left-1"]',
        )
        ?.getAttribute('data-side'),
    ).toBe('left');
  });
});
