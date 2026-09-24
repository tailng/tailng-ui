import type {
  TngSplitLayoutResult,
  TngSplitPairConstraints,
  TngSplitPairResult,
  TngSplitPaneLayout,
} from './tng-split-layout.types';

const EPSILON = 0.01;

export function normalizeTngSplitSize(value: number, fallback: number, minimum = 0): number {
  return Number.isFinite(value) ? Math.max(minimum, value) : fallback;
}

export function clampTngSplitSize(value: number, minimum: number, maximum: number): number {
  const normalizedMinimum = normalizeTngSplitSize(minimum, 0);
  const normalizedMaximum = Math.max(
    normalizedMinimum,
    Number.isFinite(maximum) ? maximum : Number.POSITIVE_INFINITY,
  );
  return Math.min(normalizedMaximum, Math.max(normalizedMinimum, value));
}


export function resizeTngSplitPair(
  pair: Readonly<TngSplitPairResult>,
  delta: number,
  constraints: Readonly<TngSplitPairConstraints>,
): TngSplitPairResult {
  const pairSize =
    Math.max(0, pair.previousSize) + Math.max(0, pair.nextSize);

  const previousMinimum = Math.max(
    normalizeTngSplitSize(constraints.previousMin, 0),
    pairSize - normalizeMaximum(constraints.nextMax),
  );

  const previousMaximum = Math.min(
    normalizeMaximum(constraints.previousMax),
    pairSize - normalizeTngSplitSize(constraints.nextMin, 0),
  );

  const safeMaximum = Math.max(previousMinimum, previousMaximum);

  const resizedPrevious = clampTngSplitSize(
    Math.max(0, pair.previousSize) + (Number.isFinite(delta) ? delta : 0),
    previousMinimum,
    safeMaximum,
  );

  return {
    previousSize: resizedPrevious,
    nextSize: Math.max(0, pairSize - resizedPrevious),
  };
}


export function allocateTngSplitLayout(
  availableSize: number,
  panes: readonly TngSplitPaneLayout[],
): TngSplitLayoutResult {
  const available = normalizeTngSplitSize(availableSize, 0);
  const normalized = panes.map((pane) => normalizePane(pane));

  let sizes = normalized.map((pane) =>
    pane.collapsed
      ? pane.collapsedSize
      : clampTngSplitSize(pane.desiredSize, pane.minSize, pane.maxSize),
  );

  let total = sum(sizes);

  if (total < available - EPSILON) {
    sizes = growIntoSpace(normalized, sizes, available - total);
    total = sum(sizes);
  }

  for (const growOnly of [true, false]) {
    if (total <= available + EPSILON) {
      break;
    }

    const indexes = normalized.flatMap((pane, index) =>
      !pane.collapsed && (!growOnly || pane.grow > 0) ? [index] : [],
    );

    sizes = shrinkWithinMinimums(normalized, sizes, {
      initialExcess: total - available,
      indexes,
    });
    total = sum(sizes);
  }

  const constrained = total > available + EPSILON;

  if (constrained) {
    sizes = emergencyFit(normalized, sizes, available);
  }

  return {
    sizes: new Map(normalized.map((pane, index) => [pane.id, roundSize(sizes[index] ?? 0)])),
    constrained,
  };
}

function normalizePane(pane: TngSplitPaneLayout): TngSplitPaneLayout {
  const minSize = normalizeTngSplitSize(pane.minSize, 0);
  const maxSize = Math.max(minSize, normalizeMaximum(pane.maxSize));
  const collapsedSize = normalizeTngSplitSize(pane.collapsedSize, 0);
  return {
    ...pane,
    desiredSize: normalizeTngSplitSize(pane.desiredSize, minSize),
    minSize,
    maxSize,
    grow: normalizeTngSplitSize(pane.grow, 0),
    collapsedSize,
  };
}


function growIntoSpace(
  panes: readonly TngSplitPaneLayout[],
  initialSizes: readonly number[],
  initialSpace: number,
): number[] {
  const sizes = [...initialSizes];
  let space = initialSpace;

  let candidates = panes
    .map((pane, index) => ({ pane, index }))
    .filter(({ pane, index }) => !pane.collapsed && pane.grow > 0 && sizes[index] < pane.maxSize);

  while (space > EPSILON && candidates.length > 0) {
    const totalWeight = sum(candidates.map(({ pane }) => pane.grow));
    let consumed = 0;

    for (const { pane, index } of candidates) {
      const capacity = pane.maxSize - sizes[index];
      const share = totalWeight > 0 ? (space * pane.grow) / totalWeight : space / candidates.length;
      const addition = Math.min(capacity, share);

      sizes[index] += addition;
      consumed += addition;
    }

    if (consumed <= EPSILON) {
      break;
    }

    space -= consumed;
    candidates = candidates.filter(({ pane, index }) => sizes[index] < pane.maxSize - EPSILON);
  }

  return sizes;
}


function shrinkWithinMinimums(
  panes: readonly TngSplitPaneLayout[],
  initialSizes: readonly number[],
  options: Readonly<{
    initialExcess: number;
    indexes: readonly number[];
  }>,
): number[] {
  const sizes = [...initialSizes];
  let excess = options.initialExcess;

  let candidates = options.indexes.filter(
    (index) => sizes[index] > panes[index].minSize + EPSILON,
  );

  while (excess > EPSILON && candidates.length > 0) {
    const totalCapacity = sum(
      candidates.map((index) => sizes[index] - panes[index].minSize),
    );

    let consumed = 0;

    for (const index of candidates) {
      const capacity = sizes[index] - panes[index].minSize;
      const share =
        totalCapacity > 0
          ? (excess * capacity) / totalCapacity
          : excess / candidates.length;

      const reduction = Math.min(capacity, share);

      sizes[index] -= reduction;
      consumed += reduction;
    }

    if (consumed <= EPSILON) {
      break;
    }

    excess -= consumed;

    candidates = candidates.filter(
      (index) => sizes[index] > panes[index].minSize + EPSILON,
    );
  }

  return sizes;
}


function emergencyFit(
  panes: readonly TngSplitPaneLayout[],
  initialSizes: readonly number[],
  available: number,
): number[] {
  const sizes = [...initialSizes];

  const collapsedTotal = sum(
    panes.map((pane, index) => (pane.collapsed ? sizes[index] : 0)),
  );

  const expandedIndexes = panes.flatMap((pane, index) =>
    !pane.collapsed ? [index] : [],
  );

  if (collapsedTotal <= available && expandedIndexes.length > 0) {
    const expandedAvailable = Math.max(0, available - collapsedTotal);
    const expandedTotal = sum(expandedIndexes.map((index) => sizes[index]));
    const ratio = expandedTotal > 0 ? expandedAvailable / expandedTotal : 0;

    for (const index of expandedIndexes) {
      sizes[index] *= ratio;
    }

    return sizes;
  }

  const total = sum(sizes);
  const ratio = total > 0 ? available / total : 0;

  for (let index = 0; index < sizes.length; index += 1) {
    sizes[index] *= ratio;
  }

  return sizes;
}

function normalizeMaximum(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : Number.POSITIVE_INFINITY;
}

function roundSize(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
