import type { TngAngularCdkSelectionModelDelegates } from './selection-model.adapter';
import type {
  TngSelectionMode,
  TngSelectionModel,
  TngSelectionModelOptions,
  TngSelectionRangeMode,
  TngSelectionRangeOptions,
} from '@tailng-ui/cdk/collections';

function toSelectionMode(mode: TngSelectionMode | undefined): TngSelectionMode {
  return mode ?? 'single';
}

function findRangeValues<TValue>(
  from: TValue,
  to: TValue,
  orderedValues: readonly TValue[],
): readonly TValue[] {
  const fromIndex = orderedValues.indexOf(from);
  const toIndex = orderedValues.indexOf(to);
  if (fromIndex < 0 || toIndex < 0) {
    return [];
  }

  const start = Math.min(fromIndex, toIndex);
  const end = Math.max(fromIndex, toIndex);
  return orderedValues.slice(start, end + 1);
}

class AngularCdkSelectionModel<TValue> implements TngSelectionModel<TValue> {
  private anchor: TValue | null;
  private readonly mode: TngSelectionMode;
  private readonly selectedSet: Set<TValue>;

  public constructor(options: TngSelectionModelOptions<TValue>) {
    this.mode = toSelectionMode(options.mode);
    this.selectedSet = new Set(options.initialSelected ?? []);
    this.anchor = options.initialAnchor ?? options.initialSelected?.[0] ?? null;
  }

  public clear(): void {
    this.selectedSet.clear();
    this.anchor = null;
  }

  public deselect(value: TValue): void {
    this.selectedSet.delete(value);
    if (this.selectedSet.size === 0 && this.anchor === value) {
      this.anchor = null;
    }
  }

  public getAnchor(): TValue | null {
    return this.anchor;
  }

  public getSelected(): readonly TValue[] {
    return [...this.selectedSet.values()];
  }

  public isSelected(value: TValue): boolean {
    return this.selectedSet.has(value);
  }

  public select(value: TValue): void {
    if (this.mode === 'single') {
      this.selectedSet.clear();
    }

    this.selectedSet.add(value);
    this.anchor = value;
  }

  public selectRange(
    from: TValue,
    to: TValue,
    options: TngSelectionRangeOptions<TValue>,
  ): readonly TValue[] {
    this.anchor = from;
    if (this.mode === 'single') {
      this.select(to);
      return this.getSelected();
    }

    const rangeValues = findRangeValues(from, to, options.orderedValues);
    if (rangeValues.length === 0) {
      return this.getSelected();
    }

    this.mergeRangeValues(rangeValues, options.rangeMode ?? 'replace');
    return this.getSelected();
  }

  public setAnchor(value: TValue | null): void {
    this.anchor = value;
  }

  public toggle(value: TValue): void {
    if (this.selectedSet.has(value)) {
      this.selectedSet.delete(value);
      if (this.selectedSet.size === 0) {
        this.anchor = null;
      }
      return;
    }

    this.select(value);
  }

  private mergeRangeValues(rangeValues: readonly TValue[], mode: TngSelectionRangeMode): void {
    if (mode === 'replace') {
      this.selectedSet.clear();
    }

    for (const value of rangeValues) {
      this.selectedSet.add(value);
    }
  }
}

export type TngAngularCdkSelectionModelDelegateFactoryOptions = Readonly<Record<string, never>>;

export function createAngularCdkSelectionModelDelegates(
  _options: TngAngularCdkSelectionModelDelegateFactoryOptions = {},
): TngAngularCdkSelectionModelDelegates {
  return Object.freeze({
    createSelectionModel: <TValue>(
      options: TngSelectionModelOptions<TValue>,
    ): TngSelectionModel<TValue> => new AngularCdkSelectionModel(options),
  });
}
