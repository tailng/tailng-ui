import { createSelectionModel } from '@tailng-ui/cdk/collections';
import type {
  TngTableRowSelectionController,
  TngTableRowSelectionOptions,
  TngTableRowSelectionState,
} from './selection.types';

function filterSelectableIds<TId>(
  ids: readonly TId[],
  disabledIds: ReadonlySet<TId>,
): readonly TId[] {
  return ids.filter((id) => !disabledIds.has(id));
}

class TngTableRowSelectionControllerImpl<TId> implements TngTableRowSelectionController<TId> {
  private readonly disabledIds: ReadonlySet<TId>;
  private readonly mode: 'multiple' | 'single';
  private readonly model: ReturnType<typeof createSelectionModel<TId>>;

  public constructor(options: TngTableRowSelectionOptions<TId>) {
    this.mode = options.mode ?? 'single';
    this.disabledIds = new Set(options.disabledIds ?? []);

    const initialSelected = filterSelectableIds(options.initialSelectedIds ?? [], this.disabledIds);
    const initialAnchorId =
      options.initialAnchorId !== undefined &&
      options.initialAnchorId !== null &&
      !this.disabledIds.has(options.initialAnchorId)
        ? options.initialAnchorId
        : (initialSelected[0] ?? null);

    this.model = createSelectionModel<TId>({
      initialAnchor: initialAnchorId,
      initialSelected,
      mode: this.mode,
    });
  }

  public clear(): TngTableRowSelectionState<TId> {
    this.model.clear();
    return this.getState();
  }

  public deselect(id: TId): TngTableRowSelectionState<TId> {
    this.model.deselect(id);
    return this.getState();
  }

  public getState(): TngTableRowSelectionState<TId> {
    return Object.freeze({
      anchorId: this.model.getAnchor(),
      mode: this.mode,
      selectedIds: Object.freeze([...this.model.getSelected()]),
    });
  }

  public isDisabled(id: TId): boolean {
    return this.disabledIds.has(id);
  }

  public isSelected(id: TId): boolean {
    return this.model.isSelected(id);
  }

  public replace(id: TId): TngTableRowSelectionState<TId> {
    if (this.isDisabled(id)) {
      return this.getState();
    }

    this.model.clear();
    this.model.select(id);
    return this.getState();
  }

  public select(id: TId): TngTableRowSelectionState<TId> {
    if (this.isDisabled(id)) {
      return this.getState();
    }

    this.model.select(id);
    return this.getState();
  }

  public selectAll(ids: readonly TId[]): TngTableRowSelectionState<TId> {
    const selectableIds = filterSelectableIds(ids, this.disabledIds);
    this.model.clear();

    if (this.mode === 'single') {
      const firstId = selectableIds[0];
      if (firstId !== undefined) {
        this.model.select(firstId);
      }

      return this.getState();
    }

    for (const id of selectableIds) {
      this.model.select(id);
    }

    return this.getState();
  }

  public selectRange(
    from: TId,
    to: TId,
    orderedIds: readonly TId[],
  ): TngTableRowSelectionState<TId> {
    if (this.isDisabled(from) || this.isDisabled(to)) {
      return this.getState();
    }

    this.model.selectRange(from, to, {
      orderedValues: filterSelectableIds(orderedIds, this.disabledIds),
    });

    return this.getState();
  }

  public toggle(id: TId): TngTableRowSelectionState<TId> {
    if (this.isDisabled(id)) {
      return this.getState();
    }

    this.model.toggle(id);
    return this.getState();
  }
}

export function createTngRowSelectionController<TId>(
  options: TngTableRowSelectionOptions<TId> = {},
): TngTableRowSelectionController<TId> {
  return new TngTableRowSelectionControllerImpl(options);
}
