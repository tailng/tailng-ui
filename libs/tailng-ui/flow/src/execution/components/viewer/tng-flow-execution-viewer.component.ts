/* eslint-disable complexity, no-console -- The composite viewer coordinates controlled graph, inspector, resize, and development diagnostics. */
import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import type { OnDestroy } from '@angular/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
  isDevMode,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  TngButtonComponent,
  TngSplitGroupComponent,
  TngSplitHandleComponent,
  TngSplitPaneDirective,
  type TngSplitResizeEvent,
} from '@tailng-ui/components';
import { areTngFlowSelectionsEqual } from '../../../lib/model/tng-flow-selection';
import type { TngFlowSmartGuidesOptions } from '../../../lib/types/tng-flow-arrangement.types';
import type {
  TngFlowConnectionAriaLabelFactory,
  TngFlowEditorConnectionOptions,
  TngFlowEditorOptions,
} from '../../../lib/types/tng-flow-connection.types';
import type { TngFlowKeyboardOptions } from '../../../lib/types/tng-flow-keyboard.types';
import type { TngFlowMinimapOptions } from '../../../lib/types/tng-flow-minimap.types';
import type {
  TngFlowDefinition,
  TngFlowEditorMode,
  TngFlowSelection,
  TngFlowViewport,
} from '../../../lib/types/tng-flow.types';
import { EMPTY_TNG_FLOW_SELECTION } from '../../../lib/types/tng-flow.types';
import {
  createTngFlowExecutionIndex,
  resolveTngFlowExecutionInspectedNodeId,
  resolveTngFlowSelectedExecution,
} from '../../model/tng-flow-execution.model';
import type {
  TngFlowExecutionActivatedEvent,
  TngFlowExecutionDateTimeFormatter,
  TngFlowExecutionInspectorPosition,
  TngFlowExecutionInspectorScope,
  TngFlowExecutionViewerState,
  TngFlowRunExecutionSnapshot,
} from '../../model/tng-flow-execution.types';
import {
  TngFlowExecutionInspectorTemplateDirective,
  type TngFlowExecutionInspectorTemplateContext,
} from '../../templates/tng-flow-execution-templates';
import { TngFlowExecutionGraphComponent } from '../graph/tng-flow-execution-graph.component';
import { TngFlowExecutionInspectorComponent } from '../inspector/tng-flow-execution-inspector.component';

const DEFAULT_INSPECTOR_BREAKPOINT = 720;
const DEFAULT_RIGHT_INSPECTOR_SIZE = 360;
const DEFAULT_BOTTOM_INSPECTOR_SIZE = 280;
const DEFAULT_GRAPH_MIN_SIZE = 320;
const DEFAULT_INSPECTOR_MIN_SIZE = 240;

@Component({
  selector: 'tng-flow-execution-viewer',
  imports: [
    NgTemplateOutlet,
    TngButtonComponent,
    TngFlowExecutionGraphComponent,
    TngFlowExecutionInspectorComponent,
    TngSplitGroupComponent,
    TngSplitHandleComponent,
    TngSplitPaneDirective,
  ],
  templateUrl: './tng-flow-execution-viewer.component.html',
  styleUrl: './tng-flow-execution-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'tngFlowExecutionViewer',
  host: {
    class: 'tng-flow-execution-viewer',
    '[attr.data-state]': 'state()',
    '[attr.data-inspector-open]': 'showResolvedInspector() ? "" : null',
    '[attr.data-inspector-position]': 'resolvedInspectorPosition()',
  },
})
export class TngFlowExecutionViewerComponent<TPayload = unknown> implements OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly documentRef = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly graph = viewChild(TngFlowExecutionGraphComponent);
  private readonly warningSignatures = new Set<string>();
  private resizeObserver: ResizeObserver | null = null;
  private resizeCleanup: (() => void) | null = null;

  public readonly definition = input<TngFlowDefinition | null>(null);
  public readonly snapshot = input<TngFlowRunExecutionSnapshot<TPayload> | null>(null);
  public readonly selection = input<TngFlowSelection>(EMPTY_TNG_FLOW_SELECTION);
  public readonly inspectedNodeId = input<string | null>(null);
  public readonly selectedExecutionId = input<string | null>(null);
  public readonly viewport = input<TngFlowViewport | null>(null);
  public readonly mode = input<Extract<TngFlowEditorMode, 'inspect' | 'readonly'>>('inspect');
  public readonly state = input<TngFlowExecutionViewerState>('ready');
  public readonly stateMessage = input<string | null>(null);
  public readonly inspectorScope = input<TngFlowExecutionInspectorScope>('auto');
  public readonly inspectorPosition = input<TngFlowExecutionInspectorPosition>('auto');
  public readonly showInspector = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly inspectorOpen = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showControls = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showBackground = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly showMinimap = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly showSelectionArea = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly fitOnInit = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  public readonly readonly = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  public readonly flowId = input<string>('tng-flow-execution-viewer');
  public readonly ariaLabel = input<string>('Workflow execution viewer');
  public readonly inspectorBreakpoint = input<number>(DEFAULT_INSPECTOR_BREAKPOINT);
  public readonly rightInspectorSize = input<number>(DEFAULT_RIGHT_INSPECTOR_SIZE);
  public readonly bottomInspectorSize = input<number>(DEFAULT_BOTTOM_INSPECTOR_SIZE);
  public readonly graphMinSize = input<number>(DEFAULT_GRAPH_MIN_SIZE);
  public readonly inspectorMinSize = input<number>(DEFAULT_INSPECTOR_MIN_SIZE);
  public readonly options = input<TngFlowEditorOptions | null>(null);
  public readonly connectionOptions = input<TngFlowEditorConnectionOptions | null>(null);
  public readonly connectionAriaLabel = input<TngFlowConnectionAriaLabelFactory | null>(null);
  public readonly keyboardOptions = input<TngFlowKeyboardOptions | null>(null);
  public readonly smartGuides = input<TngFlowSmartGuidesOptions | null>(null);
  public readonly minimapOptions = input<TngFlowMinimapOptions | null>(null);
  public readonly dateTimeFormatter = input<TngFlowExecutionDateTimeFormatter | null>(null);

  public readonly selectionChange = output<TngFlowSelection>();
  public readonly inspectedNodeIdChange = output<string | null>();
  public readonly selectedExecutionIdChange = output<string | null>();
  public readonly viewportChange = output<TngFlowViewport>();
  public readonly inspectorOpenChange = output<boolean>();
  public readonly executionActivated = output<TngFlowExecutionActivatedEvent<TPayload>>();

  protected readonly inspectorTemplate = contentChild(
    TngFlowExecutionInspectorTemplateDirective<TPayload>,
  );

  private readonly containerWidth = signal(DEFAULT_INSPECTOR_BREAKPOINT + 1);

  protected readonly index = computed(() =>
    createTngFlowExecutionIndex(this.definition(), this.snapshot()),
  );

  protected readonly effectiveInspectedNodeId = computed(() =>
    resolveTngFlowExecutionInspectedNodeId(
      this.definition(),
      this.selection(),
      this.inspectedNodeId(),
    ),
  );

  protected readonly inspectedNodeExecutions = computed(
    () => this.index().nodeExecutionsByNodeId.get(this.effectiveInspectedNodeId() ?? '') ?? [],
  );

  protected readonly effectiveSelectedExecution = computed(() =>
    resolveTngFlowSelectedExecution(this.inspectedNodeExecutions(), this.selectedExecutionId()),
  );

  protected readonly effectiveSelectedExecutionId = computed(
    () => this.effectiveSelectedExecution()?.id ?? null,
  );

  protected readonly showResolvedInspector = computed(
    () => this.showInspector() && this.inspectorOpen(),
  );

  protected readonly resolvedInspectorPosition = computed<
    Exclude<TngFlowExecutionInspectorPosition, 'auto'>
  >(() => {
    const requested = this.inspectorPosition();
    if (requested === 'right' || requested === 'bottom') {
      return requested;
    }
    return this.containerWidth() <
      this.normalizedPositiveNumber(this.inspectorBreakpoint(), DEFAULT_INSPECTOR_BREAKPOINT)
      ? 'bottom'
      : 'right';
  });

  protected readonly splitOrientation = computed(() =>
    this.resolvedInspectorPosition() === 'right' ? 'horizontal' : 'vertical',
  );

  protected readonly inspectorSize = computed(() =>
    this.resolvedInspectorPosition() === 'right'
      ? this.normalizedPositiveNumber(this.rightInspectorSize(), DEFAULT_RIGHT_INSPECTOR_SIZE)
      : this.normalizedPositiveNumber(this.bottomInspectorSize(), DEFAULT_BOTTOM_INSPECTOR_SIZE),
  );

  protected readonly normalizedGraphMinSize = computed(() =>
    this.normalizedPositiveNumber(this.graphMinSize(), DEFAULT_GRAPH_MIN_SIZE),
  );

  protected readonly normalizedInspectorMinSize = computed(() =>
    this.normalizedPositiveNumber(this.inspectorMinSize(), DEFAULT_INSPECTOR_MIN_SIZE),
  );

  protected readonly inspectorTemplateContext = computed<
    TngFlowExecutionInspectorTemplateContext<TPayload>
  >(() => ({
    $implicit: this.snapshot(),
    snapshot: this.snapshot(),
    inspectedNodeId: this.effectiveInspectedNodeId(),
    selectedExecution: this.effectiveSelectedExecution(),
  }));

  private readonly resizeEffect = afterRenderEffect((onCleanup) => {
    this.observeContainer();
    onCleanup(() => this.disconnectResizeObserver());
  });

  public ngOnDestroy(): void {
    this.disconnectResizeObserver();
  }

  public refreshLayout(): void {
    this.graph()?.refreshLayout();
  }

  public fitToScreen(animated = true, padding = 48): void {
    this.graph()?.fitToScreen(animated, padding);
  }

  public resetViewport(animated = true): void {
    this.graph()?.resetViewport(animated);
  }

  public centerNode(nodeId: string, animated = true): boolean {
    return this.graph()?.centerNode(nodeId, animated) ?? false;
  }

  public onEditorSelectionChange(selection: TngFlowSelection): void {
    const graph = this.graph();
    if (graph !== undefined) {
      graph.onEditorSelectionChange(selection);
      return;
    }
    if (areTngFlowSelectionsEqual(selection, this.selection())) {
      return;
    }
    const inspectedNodeId = resolveTngFlowExecutionInspectedNodeId(
      this.definition(),
      selection,
      this.inspectedNodeId(),
    );
    const selectedExecutionId =
      resolveTngFlowSelectedExecution(
        this.index().nodeExecutionsByNodeId.get(inspectedNodeId ?? '') ?? [],
        this.selectedExecutionId(),
      )?.id ?? null;
    this.selectionChange.emit(selection);
    if (inspectedNodeId !== this.effectiveInspectedNodeId()) {
      this.inspectedNodeIdChange.emit(inspectedNodeId);
    }
    if (selectedExecutionId !== this.effectiveSelectedExecutionId()) {
      this.selectedExecutionIdChange.emit(selectedExecutionId);
    }
  }

  protected onInspectorExecutionSelected(executionId: string | null): void {
    if (executionId !== this.effectiveSelectedExecutionId()) {
      this.selectedExecutionIdChange.emit(executionId);
    }
  }

  protected onInspectorExecutionActivated(event: TngFlowExecutionActivatedEvent<TPayload>): void {
    this.executionActivated.emit(event);
  }

  protected onViewportChange(viewport: TngFlowViewport): void {
    this.viewportChange.emit(viewport);
  }

  protected toggleInspector(): void {
    const next = !this.showResolvedInspector();
    this.inspectorOpenChange.emit(next);
    if (!next) {
      this.restoreFocusAfterInspectorCollapse();
    }
  }

  protected onSplitResize(event: TngSplitResizeEvent): void {
    const inspectorPaneSize =
      this.resolvedInspectorPosition() === 'right' ? event.nextPaneSize : event.nextPaneSize;
    if (!Number.isFinite(inspectorPaneSize) || inspectorPaneSize < 0) {
      this.warnOnce('invalid-number', 'split-size', 'Invalid split pane size received.');
    }
  }

  private observeContainer(): void {
    if (this.resizeObserver !== null || this.resizeCleanup !== null) {
      return;
    }
    const element = this.hostRef.nativeElement;
    const ownerWindow = element.ownerDocument.defaultView;
    const resizeObserverConstructor = ownerWindow?.ResizeObserver;
    if (resizeObserverConstructor !== undefined) {
      this.resizeObserver = new resizeObserverConstructor((entries) => {
        const width = entries[0]?.contentRect.width;
        if (width !== undefined && Number.isFinite(width)) {
          this.zone.run(() => {
            this.containerWidth.set(width);
            this.changeDetector.markForCheck();
          });
        }
      });
      this.resizeObserver.observe(element);
      return;
    }
    if (ownerWindow !== undefined && ownerWindow !== null) {
      const resize = (): void => {
        this.containerWidth.set(element.getBoundingClientRect().width);
        this.changeDetector.markForCheck();
      };
      ownerWindow.addEventListener('resize', resize);
      this.resizeCleanup = (): void => ownerWindow.removeEventListener('resize', resize);
      resize();
    }
  }

  private disconnectResizeObserver(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.resizeCleanup?.();
    this.resizeCleanup = null;
  }

  private normalizedPositiveNumber(value: number, fallback: number): number {
    if (Number.isFinite(value) && value > 0) {
      return value;
    }
    this.warnOnce('invalid-number', String(value), `Invalid numeric option "${value}".`);
    return fallback;
  }

  private warnOnce(code: string, id: string, message: string): void {
    if (!isDevMode()) {
      return;
    }
    const signature = `${this.snapshot()?.id ?? 'no-snapshot'}|${this.snapshot()?.definitionRevision ?? ''}|${code}|${id}`;
    if (this.warningSignatures.has(signature)) {
      return;
    }
    this.warningSignatures.add(signature);
    console.warn(`[TngFlowExecutionViewer] ${message}`);
  }

  private restoreFocusAfterInspectorCollapse(): void {
    const activeElement = this.documentRef.activeElement;
    if (!(activeElement instanceof HTMLElement)) {
      return;
    }
    if (!this.hostRef.nativeElement.contains(activeElement)) {
      return;
    }
    queueMicrotask(() => this.hostRef.nativeElement.focus());
  }
}
