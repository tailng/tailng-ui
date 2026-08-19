import { getRegistryItem } from './registry';
import type { RegistryInstallMetadata, RegistryItem, RegistryItemSource } from './registry.types';

export function getRegistryInstallMetadata(name: string): RegistryInstallMetadata | undefined {
  return getRegistryItem(name)?.install;
}

/** @deprecated Registry items now own their install metadata. */
export function withRegistryInstallMetadata(item: RegistryItemSource): RegistryItem {
  const install = getRegistryInstallMetadata(item.name);

  if (install === undefined) {
    throw new Error(`Missing install metadata for registry item "${item.name}".`);
  }

  return {
    ...item,
    install,
  };
}
