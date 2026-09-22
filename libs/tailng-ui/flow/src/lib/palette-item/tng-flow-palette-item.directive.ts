import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  output,
  type OnDestroy,
  type OnInit,
  type TemplateRef,
} from '@angular/core';
import { F_EXTERNAL_ITEM, FExternalItemService, type FExternalItemBase } from '@foblex/flow';
import type { TngFlowPaletteItem, TngFlowPaletteItemActivation } from '../types/tng-flow.types';

const paletteItemEnvelopeMarker = Symbol('TngFlowPaletteItemEnvelope');
const paletteItemDragThreshold = 5;
const paletteItemClickSuppressionDuration = 500;
let paletteItemInstanceSequence = 0;

export type TngFlowPaletteItemEnvelope<TData = unknown> = Readonly<{
  readonly [paletteItemEnvelopeMarker]: true;
  item: TngFlowPaletteItem<TData>;
}>;

export function createTngFlowPaletteItemEnvelope<TData>(
  item: TngFlowPaletteItem<TData>,
): TngFlowPaletteItemEnvelope<TData> {
  return { [paletteItemEnvelopeMarker]: true, item };
}

export function readTngFlowPaletteItemEnvelope<TData>(
  value: unknown,
): TngFlowPaletteItemEnvelope<TData> | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }
  const candidate = value as Partial<TngFlowPaletteItemEnvelope<TData>>;
  return candidate[paletteItemEnvelopeMarker] === true && candidate.item !== undefined
    ? (candidate as TngFlowPaletteItemEnvelope<TData>)
    : undefined;
}

@Directive({
  selector: '[tngFlowPaletteItem]',
  providers: [
    {
      provide: F_EXTERNAL_ITEM,
      useExisting: TngFlowPaletteItemDirective,
    },
  ],
  host: {
    class: 'f-component f-external-item tng-flow-palette-item',
    fExternalItem: '',
    '[attr.aria-disabled]': "disabled() ? 'true' : null",
    '[attr.data-disabled]': "disabled() ? '' : null",
    '[attr.data-palette-item-id]': 'tngFlowPaletteItem().id',
    '[class.f-external-item-disabled]': 'disabled()',
    '(pointerdown)': 'onPointerDown($event)',
    '(click)': 'onActivate($event)',
  },
  exportAs: 'tngFlowPaletteItem',
})
export class TngFlowPaletteItemDirective<TData = unknown> implements OnInit, OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly documentRef = inject(DOCUMENT);
  private readonly externalItemService = inject(FExternalItemService);
  private readonly instanceId = `tng-flow-palette-item-${paletteItemInstanceSequence++}`;
  private readonly hostElement = this.hostRef.nativeElement;
  private pointerStart: Readonly<{ pointerId: number; x: number; y: number }> | undefined;
  private suppressPointerActivation = false;
  private clickSuppressionTimer: ReturnType<typeof setTimeout> | undefined;

  public readonly tngFlowPaletteItem = input.required<TngFlowPaletteItem<TData>>();
  public readonly tngFlowPaletteItemDisabled = input<boolean, boolean | string>(false, {
    transform: booleanAttribute,
  });
  private readonly externalItemId = computed(
    () => `${this.instanceId}-${this.tngFlowPaletteItem().id}`,
  );
  private readonly data = computed(() =>
    createTngFlowPaletteItemEnvelope(this.tngFlowPaletteItem()),
  );
  public readonly disabled = computed(
    () => this.tngFlowPaletteItemDisabled() || this.tngFlowPaletteItem().disabled === true,
  );
  public readonly tngFlowPaletteItemPreview = model<TemplateRef<unknown> | undefined>(undefined);
  private readonly preview = this.tngFlowPaletteItemPreview;
  public readonly tngFlowPaletteItemPreviewMatchSize = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  private readonly previewMatchSize = this.tngFlowPaletteItemPreviewMatchSize;
  public readonly tngFlowPaletteItemPlaceholder = model<TemplateRef<unknown> | undefined>(
    undefined,
  );
  private readonly placeholder = this.tngFlowPaletteItemPlaceholder;
  public readonly tngFlowPaletteItemActivate = output<TngFlowPaletteItemActivation<TData>>();

  public ngOnInit(): void {
    this.externalItemService.register(this.asExternalItem());
  }

  public ngOnDestroy(): void {
    this.stopPointerTracking();
    this.clearPointerActivationSuppression();
    this.externalItemService.remove(this.asExternalItem());
  }

  protected onPointerDown(event: PointerEvent): void {
    if (this.disabled() || !event.isPrimary || event.button !== 0) {
      return;
    }
    this.stopPointerTracking();
    this.clearPointerActivationSuppression();
    this.pointerStart = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    this.documentRef.addEventListener('pointermove', this.onPointerMove, true);
    this.documentRef.addEventListener('pointerup', this.onPointerEnd, true);
    this.documentRef.addEventListener('pointercancel', this.onPointerEnd, true);
  }

   
  protected onActivate(event: MouseEvent): void {
    if (event.detail > 0 && this.suppressPointerActivation) {
      this.clearPointerActivationSuppression();
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (this.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.tngFlowPaletteItemActivate.emit({
      item: this.tngFlowPaletteItem(),
      source: event.detail === 0 ? 'keyboard' : 'pointer',
    });
  }

  private asExternalItem(): FExternalItemBase<TngFlowPaletteItemEnvelope<TData>> {
    return this as unknown as FExternalItemBase<TngFlowPaletteItemEnvelope<TData>>;
  }

   
  private readonly onPointerMove = (event: PointerEvent): void => {
    const start = this.pointerStart;
    if (start?.pointerId !== event.pointerId) {
      return;
    }
    const distance = Math.hypot(event.clientX - start.x, event.clientY - start.y);
    if (distance >= paletteItemDragThreshold) {
      this.suppressPointerActivation = true;
    }
  };

   
  private readonly onPointerEnd = (event: PointerEvent): void => {
    if (this.pointerStart?.pointerId !== event.pointerId) {
      return;
    }
    this.stopPointerTracking();
    if (this.suppressPointerActivation) {
      this.clickSuppressionTimer = setTimeout(
        () => this.clearPointerActivationSuppression(),
        paletteItemClickSuppressionDuration,
      );
    }
  };

  private stopPointerTracking(): void {
    this.pointerStart = undefined;
    this.documentRef.removeEventListener('pointermove', this.onPointerMove, true);
    this.documentRef.removeEventListener('pointerup', this.onPointerEnd, true);
    this.documentRef.removeEventListener('pointercancel', this.onPointerEnd, true);
  }

  private clearPointerActivationSuppression(): void {
    this.suppressPointerActivation = false;
    if (this.clickSuppressionTimer !== undefined) {
      clearTimeout(this.clickSuppressionTimer);
      this.clickSuppressionTimer = undefined;
    }
  }
}
