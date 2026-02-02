export type TngSnackbarIntent = 'default' | 'success' | 'info' | 'warning' | 'error';

export type TngSnackbarItem = {
  id: string;
  message: string;
  intent?: TngSnackbarIntent;

  /** Optional action button */
  actionLabel?: string;

  /** Auto-dismiss duration (ms). 0/undefined disables auto-dismiss. */
  durationMs?: number;
};
