import { shouldUseAngularCdkFeature } from './adapter-config';
import type { TngAngularCdkAdapterConfig } from './adapter.types';
import {
  createSelectionModel,
  type TngSelectionModel,
  type TngSelectionModelOptions,
} from '@tailng-ui/cdk/collections';

export type TngAngularCdkSelectionModelDelegates = Readonly<{
  createSelectionModel?: <TValue>(
    options: TngSelectionModelOptions<TValue>,
  ) => TngSelectionModel<TValue>;
}>;

export type TngSelectionModelAdapterOptions<TValue> = Readonly<{
  adapterConfig?: TngAngularCdkAdapterConfig;
  angularCdk?: TngAngularCdkSelectionModelDelegates;
  selection: TngSelectionModelOptions<TValue>;
}>;

export function createSelectionModelAdapter<TValue>(
  options: TngSelectionModelAdapterOptions<TValue>,
): TngSelectionModel<TValue> {
  const useAngularCdk = shouldUseAngularCdkFeature(options.adapterConfig, 'selection-model');

  if (useAngularCdk && options.angularCdk?.createSelectionModel !== undefined) {
    return options.angularCdk.createSelectionModel(options.selection);
  }

  return createSelectionModel(options.selection);
}
