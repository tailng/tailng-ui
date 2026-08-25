import type { EnvironmentProviders } from '@angular/core';
import {
  type TngIconPack,
  type TngIconPackLoaders,
  type TngResolvedIconConfig,
  ɵconfigureTngDefaultIconConfigFactory,
  ɵprovideResolvedTngIcons,
  ɵresolveTngIconConfigFromPacks,
} from '@tailng-ui/icons/core';
import { lucidePackLoaders } from './icon-loaders.generated';

export {
  TNG_DEFAULT_ICON_PACK,
  TNG_ICON_CONFIG,
  TNG_ICON_RESOLVER,
  TngIconResolver,
  createTngIconPack,
  parseTngIconRef,
} from '@tailng-ui/icons/core';

export type {
  TngIconDefinition,
  TngIconLoader,
  TngIconPack,
  TngIconPackDefinitions,
  TngIconPackLoaders,
  TngIconSvg,
  TngParsedIconRef,
  TngResolvedIconConfig,
} from '@tailng-ui/icons/core';

export type TngProvideIconsOptions = Readonly<{
  allowBuiltinOverride?: boolean;
  defaultPack?: string;
  packs?: readonly TngIconPack[];
}>;

export const TNG_BUILTIN_ICON_PACKS: Readonly<Record<string, TngIconPackLoaders>> = Object.freeze({
  lucide: lucidePackLoaders,
});

export const TNG_BUILTIN_ICON_PACK_NAMES: readonly string[] = Object.freeze(
  Object.keys(TNG_BUILTIN_ICON_PACKS),
);

export function resolveTngIconConfig(options: TngProvideIconsOptions = {}): TngResolvedIconConfig {
  return ɵresolveTngIconConfigFromPacks({
    allowReservedPackOverride: options.allowBuiltinOverride === true,
    basePacks: TNG_BUILTIN_ICON_PACKS,
    defaultPack: options.defaultPack,
    packs: options.packs ?? [],
    reservedPackNames: TNG_BUILTIN_ICON_PACK_NAMES,
  });
}

export function provideTngIcons(options?: TngProvideIconsOptions): EnvironmentProviders {
  return ɵprovideResolvedTngIcons(resolveTngIconConfig(options));
}

ɵconfigureTngDefaultIconConfigFactory(() => resolveTngIconConfig());
