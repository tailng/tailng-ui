export interface TngControllerFeature {
  readonly featureId: string;

  onInit?(): void;
  onDestroy?(): void;
}
