import { isBrowser } from '@tailng-ui/cdk/core';
import {
  type TngPortalContainerElement,
  type TngPortalManager,
  type TngPortalManagerOptions,
  type TngPortalMountOptions,
  type TngPortalNode,
} from './portal.types';

type TngMountedPortal = Readonly<{
  container: TngPortalContainerElement;
  node: TngPortalNode;
}>;

class PortalManager implements TngPortalManager {
  private readonly activePortals = new Map<string, TngMountedPortal>();
  private readonly documentRef: TngPortalManagerOptions['documentRef'];
  private readonly enabled: boolean;

  public constructor(options: TngPortalManagerOptions) {
    this.documentRef = options.documentRef;
    this.enabled = options.isBrowser ?? isBrowser(options.documentRef);
  }

  public clear(): void {
    const portalIds = this.getMountedPortalIds();
    for (const portalId of portalIds) {
      this.unmount(portalId);
    }
  }

  public getMountedPortalIds(): readonly string[] {
    return [...this.activePortals.keys()];
  }

  public isMounted(portalId: string): boolean {
    return this.activePortals.has(portalId);
  }

  public mount(options: TngPortalMountOptions): boolean {
    if (!this.enabled || this.documentRef === null || this.documentRef === undefined) {
      return false;
    }

    const container = this.resolveContainer(options.target?.elementId);
    if (container === null) {
      return false;
    }

    this.unmount(options.portalId);
    container.appendChild(options.node);
    this.activePortals.set(options.portalId, { container, node: options.node });
    return true;
  }

  public unmount(portalId: string): void {
    const mountedPortal = this.activePortals.get(portalId);
    if (mountedPortal === undefined) {
      return;
    }

    mountedPortal.container.removeChild(mountedPortal.node);
    this.activePortals.delete(portalId);
  }

  private resolveContainer(elementId: string | undefined): TngPortalContainerElement | null {
    if (this.documentRef === null || this.documentRef === undefined) {
      return null;
    }

    if (elementId === undefined) {
      return this.documentRef.body;
    }

    return this.documentRef.getElementById(elementId);
  }
}

export function createPortalManager(options: TngPortalManagerOptions = {}): TngPortalManager {
  return new PortalManager(options);
}
