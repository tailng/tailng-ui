export interface ScrollActiveIntoViewOptions {
  container: HTMLElement | null | undefined;
  activeIndex: number;
  itemSelector?: string; // default: [data-index]
  behavior?: ScrollBehavior; // default: 'auto'
}

export function scrollActiveIntoView({
  container,
  activeIndex,
  itemSelector = '[data-index]',
  behavior = 'auto',
}: ScrollActiveIntoViewOptions): void {
  if (!container) return;
  if (activeIndex < 0) return;

  const item = container.querySelector<HTMLElement>(
    `${itemSelector}="${activeIndex}"`
  );

  if (!item) return;

  const containerRect = container.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();

  // Already fully visible
  if (
    itemRect.top >= containerRect.top &&
    itemRect.bottom <= containerRect.bottom
  ) {
    return;
  }

  item.scrollIntoView({
    block: 'nearest',
    behavior,
  });
}
