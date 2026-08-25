export {
  TNG_DEFAULT_ICON_PACK,
  TNG_ICON_CONFIG,
  TNG_ICON_RESOLVER,
  TngIconResolver,
  createTngIconPack,
  parseTngIconRef,
  provideTngIcons,
  resolveTngIconConfig,
} from './lib/icons.core';

export { TngIcon } from './lib/tng-icon';

export type {
  TngIconDefinition,
  TngIconLoader,
  TngIconPack,
  TngIconPackDefinitions,
  TngIconPackLoaders,
  TngIconSvg,
  TngParsedIconRef,
  TngProvideIconsOptions,
  TngResolvedIconConfig,
} from './lib/icons.core';

export {
  configureTngDefaultIconConfigFactory as ɵconfigureTngDefaultIconConfigFactory,
  provideResolvedTngIcons as ɵprovideResolvedTngIcons,
  resolveTngIconConfigFromPacks as ɵresolveTngIconConfigFromPacks,
} from './lib/icons.core';
