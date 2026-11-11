import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, signal, type Signal } from '@angular/core';
import { observeDocsCodeThemeChanges, resolveDocsCodeBlockTheme } from '../../../../shared/util';

export function useAiChatDocsCodeTheme(): Signal<'github-dark' | 'github-light'> {
  const documentRef = inject(DOCUMENT);
  const destroyRef = inject(DestroyRef);
  const theme = signal<'github-dark' | 'github-light'>(resolveDocsCodeBlockTheme(documentRef));
  const observer = observeDocsCodeThemeChanges(documentRef, theme);
  destroyRef.onDestroy(() => observer?.disconnect());
  return theme.asReadonly();
}
