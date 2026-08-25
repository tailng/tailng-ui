import {
  createActiveDescendantController,
  createRovingFocusController,
  type TngActiveDescendantController,
  type TngActiveDescendantOptions,
  type TngRovingFocusController,
  type TngRovingFocusOptions,
} from '@tailng-ui/cdk/a11y';
import {
  createTypeaheadController,
  type TngTypeaheadController,
  type TngTypeaheadOptions,
} from '@tailng-ui/cdk/collections';
import { shouldUseAngularCdkFeature } from './adapter-config';
import type { TngAngularCdkAdapterConfig } from './adapter.types';

type TngKeyManagerAdapterOptions = Readonly<{
  adapterConfig?: TngAngularCdkAdapterConfig;
  angularCdk?: TngAngularCdkKeyManagerDelegates;
}>;

export type TngAngularCdkKeyManagerDelegates = Readonly<{
  createActiveDescendantController?: (
    options: TngActiveDescendantOptions,
  ) => TngActiveDescendantController;
  createRovingFocusController?: (options: TngRovingFocusOptions) => TngRovingFocusController;
  createTypeaheadController?: (options: TngTypeaheadOptions) => TngTypeaheadController;
}>;

export type TngRovingFocusAdapterOptions = Readonly<
  TngKeyManagerAdapterOptions & {
    rovingFocus: TngRovingFocusOptions;
  }
>;

export type TngActiveDescendantAdapterOptions = Readonly<
  TngKeyManagerAdapterOptions & {
    activeDescendant: TngActiveDescendantOptions;
  }
>;

export type TngTypeaheadAdapterOptions = Readonly<
  TngKeyManagerAdapterOptions & {
    typeahead: TngTypeaheadOptions;
  }
>;

export function createRovingFocusAdapter(
  options: TngRovingFocusAdapterOptions,
): TngRovingFocusController {
  const useAngularCdk = shouldUseAngularCdkFeature(options.adapterConfig, 'roving-focus');

  if (useAngularCdk && options.angularCdk?.createRovingFocusController !== undefined) {
    return options.angularCdk.createRovingFocusController(options.rovingFocus);
  }

  return createRovingFocusController(options.rovingFocus);
}

export function createActiveDescendantAdapter(
  options: TngActiveDescendantAdapterOptions,
): TngActiveDescendantController {
  const useAngularCdk = shouldUseAngularCdkFeature(options.adapterConfig, 'active-descendant');

  if (useAngularCdk && options.angularCdk?.createActiveDescendantController !== undefined) {
    return options.angularCdk.createActiveDescendantController(options.activeDescendant);
  }

  return createActiveDescendantController(options.activeDescendant);
}

export function createTypeaheadAdapter(
  options: TngTypeaheadAdapterOptions,
): TngTypeaheadController {
  const useAngularCdk = shouldUseAngularCdkFeature(options.adapterConfig, 'typeahead');

  if (useAngularCdk && options.angularCdk?.createTypeaheadController !== undefined) {
    return options.angularCdk.createTypeaheadController(options.typeahead);
  }

  return createTypeaheadController(options.typeahead);
}
