export const COMPONENT_ASSISTANT_NEAR_BOTTOM_PX = 48;

export type ComponentAssistantScrollGeometry = Readonly<{
  scrollHeight: number;
  clientHeight: number;
  scrollTop: number;
}>;

export function componentAssistantDistanceFromBottom(
  geometry: ComponentAssistantScrollGeometry,
): number {
  const scrollHeight = finiteNonNegative(geometry.scrollHeight);
  const clientHeight = finiteNonNegative(geometry.clientHeight);
  const scrollTop = finiteNonNegative(geometry.scrollTop);
  return Math.max(0, scrollHeight - clientHeight - scrollTop);
}

export function componentAssistantIsNearBottom(
  geometry: ComponentAssistantScrollGeometry,
  threshold = COMPONENT_ASSISTANT_NEAR_BOTTOM_PX,
): boolean {
  return componentAssistantDistanceFromBottom(geometry) <= finiteNonNegative(threshold);
}

export function addComponentAssistantUnseenMessage(
  current: ReadonlySet<string>,
  messageId: string,
): ReadonlySet<string> {
  if (messageId.length === 0 || current.has(messageId)) {
    return current;
  }
  return new Set([...current, messageId]);
}

export function componentAssistantUnseenLabel(count: number): string {
  const normalized = Math.max(0, Math.trunc(Number.isFinite(count) ? count : 0));
  if (normalized === 0) {
    return 'Jump to latest';
  }
  if (normalized === 1) {
    return 'Jump to latest — 1 new message';
  }
  return `Jump to latest — ${normalized > 99 ? '99+' : normalized} new messages`;
}

function finiteNonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}
