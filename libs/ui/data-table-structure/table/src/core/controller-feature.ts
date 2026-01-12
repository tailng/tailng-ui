export interface TailngControllerFeature {
  readonly featureId: string;

  onInit?(): void;
  onDestroy?(): void;
}
