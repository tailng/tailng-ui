import type { TngOverlayInteractionDomDocument } from '@tailng-ui/cdk/overlay';
import { createOverlayRuntime, type TngOverlayRuntime } from '@tailng-ui/cdk/runtime';

const primitiveOverlayDocument =
  typeof document === 'undefined' ? null : (document as TngOverlayInteractionDomDocument);

export const tngPrimitiveOverlayRuntime: TngOverlayRuntime = createOverlayRuntime({
  documentRef: primitiveOverlayDocument,
});
