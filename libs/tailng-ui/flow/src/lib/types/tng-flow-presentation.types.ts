import type {
  TngFlowValidationIssue,
  TngFlowValidationSeverity,
} from './tng-flow-validation.types';
import type { TngFlowNodeStatus } from './tng-flow.types';

export type TngFlowConnectionStatus =
  | 'idle'
  | 'active'
  | 'success'
  | 'warning'
  | 'error'
  | 'disabled';

export type TngFlowConnectionMotion = 'none' | 'flow' | 'pulse';

export type TngFlowConnectionMotionSpeed = 'slow' | 'normal' | 'fast';

export type TngFlowConnectionMotionDirection = 'forward' | 'reverse';

export type TngFlowProgressDisplayMode = 'explicit' | 'status-driven';

export type TngFlowNodePresentation<TStatus extends string = TngFlowNodeStatus> = Readonly<{
  status?: TStatus;
  progress?: number | null;
  statusMessage?: string | null;
  highlighted?: boolean;
  dimmed?: boolean;
}>;

export type TngFlowConnectionPresentation = Readonly<{
  status?: TngFlowConnectionStatus;
  highlighted?: boolean;
  dimmed?: boolean;
  motion?: TngFlowConnectionMotion;
  motionSpeed?: TngFlowConnectionMotionSpeed;
  motionDirection?: TngFlowConnectionMotionDirection;
  message?: string | null;
  /** @deprecated Use `motion: 'flow'` instead. */
  animated?: boolean;
}>;

export type TngFlowPresentation<TStatus extends string = TngFlowNodeStatus> = Readonly<{
  nodes?: Readonly<Record<string, TngFlowNodePresentation<TStatus>>>;
  connections?: Readonly<Record<string, TngFlowConnectionPresentation>>;
}>;

export const EMPTY_TNG_FLOW_PRESENTATION: TngFlowPresentation = Object.freeze({});

export type TngFlowResolvedNodeView<TStatus extends string = TngFlowNodeStatus> = Readonly<{
  selected: boolean;
  disabled: boolean;
  locked: boolean;
  status: TStatus;
  progress: number | null;
  progressSpecified: boolean;
  statusMessage: string | null;
  validationSeverity: TngFlowValidationSeverity | null;
  invalid: boolean;
  highlighted: boolean;
  dimmed: boolean;
}>;

export type TngFlowResolvedConnectionView = Readonly<{
  selected: boolean;
  disabled: boolean;
  status: TngFlowConnectionStatus;
  validationSeverity: TngFlowValidationSeverity | null;
  issues: readonly TngFlowValidationIssue[];
  highlighted: boolean;
  dimmed: boolean;
  motion: TngFlowConnectionMotion;
  motionSpeed: TngFlowConnectionMotionSpeed;
  motionDirection: TngFlowConnectionMotionDirection;
  message: string | null;
  /** @deprecated Use `motion !== 'none'` instead. */
  animated: boolean;
}>;
