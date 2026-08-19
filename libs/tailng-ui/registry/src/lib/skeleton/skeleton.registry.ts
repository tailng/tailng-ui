import type { RegistryItem } from '../registry.types';

const skeletonPrimitiveTsTemplate = `import { Directive, HostBinding, booleanAttribute, input } from '@angular/core';

export function resolveTngSkeletonDataAnimated(animated: boolean): 'false' | 'true' {
  return animated ? 'true' : 'false';
}

export function resolveTngSkeletonDataRounded(rounded: boolean): 'false' | 'true' {
  return rounded ? 'true' : 'false';
}

@Directive({
  selector: '[tngSkeleton]',
  exportAs: 'tngSkeleton',
})
export class TngSkeletonPrimitive {
  readonly animated = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  readonly rounded = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });

  @HostBinding('attr.aria-hidden')
  protected readonly ariaHiddenAttr = 'true' as const;

  @HostBinding('attr.role')
  protected readonly roleAttr = 'presentation' as const;

  @HostBinding('attr.data-animated')
  protected get dataAnimatedAttr(): 'false' | 'true' {
    return resolveTngSkeletonDataAnimated(this.animated());
  }

  @HostBinding('attr.data-rounded')
  protected get dataRoundedAttr(): 'false' | 'true' {
    return resolveTngSkeletonDataRounded(this.rounded());
  }

  @HostBinding('attr.data-slot')
  protected readonly dataSlot = 'skeleton' as const;
}
`;

const skeletonComponentTsTemplate = `import { booleanAttribute, Component, computed, effect, input, numberAttribute, signal } from '@angular/core';
import { TngSkeletonPrimitive } from './tng-skeleton-primitive';

export type TngSkeletonMessageMode = 'none' | 'static' | 'random';
export type TngSkeletonMessageStrategy = 'once' | 'interval';

const defaultTngSkeletonMessageInterval = 5000;

export function resolveTngSkeletonCssSize(value: string, fallback: string): string {
  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : fallback;
}

export function resolveTngSkeletonMessageInterval(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : defaultTngSkeletonMessageInterval;
}

function normalizeTngSkeletonMessage(value: string | null | undefined): string | null {
  const normalizedValue = value?.trim() ?? '';
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeTngSkeletonMessages(messages: readonly string[] | null | undefined): readonly string[] {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .map((message) => normalizeTngSkeletonMessage(message))
    .filter((message): message is string => message !== null);
}

function resolveTngSkeletonMessageMode(
  mode: TngSkeletonMessageMode | undefined,
  message: string | null,
  messages: readonly string[],
): TngSkeletonMessageMode {
  if (mode !== undefined) {
    return mode;
  }

  if (message !== null) {
    return 'static';
  }

  return messages.length > 0 ? 'random' : 'static';
}

function resolveTngSkeletonMessageStrategy(
  strategy: TngSkeletonMessageStrategy,
): TngSkeletonMessageStrategy {
  return strategy === 'interval' ? 'interval' : 'once';
}

function selectRandomTngSkeletonMessage(messages: readonly string[]): string | null {
  if (messages.length === 0) {
    return null;
  }

  const selectedIndex = Math.floor(Math.random() * messages.length);
  return messages[Math.min(selectedIndex, messages.length - 1)] ?? null;
}

@Component({
  selector: 'tng-skeleton',
  imports: [TngSkeletonPrimitive],
  templateUrl: './tng-skeleton.html',
  styleUrl: './tng-skeleton.css',
})
export class TngSkeleton {
  private readonly randomMessage = signal<string | null>(null);

  readonly animated = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  readonly height = input<string>('1rem');
  readonly message = input<string | null | undefined>(undefined);
  readonly messageInterval = input<number, number | string>(defaultTngSkeletonMessageInterval, {
    transform: numberAttribute,
  });
  readonly messageMode = input<TngSkeletonMessageMode | undefined>(undefined);
  readonly messages = input<readonly string[] | null | undefined>([]);
  readonly messageStrategy = input<TngSkeletonMessageStrategy>('once');
  readonly rounded = input<boolean, boolean | string>(true, {
    transform: booleanAttribute,
  });
  readonly width = input<string>('100%');

  protected readonly normalizedMessage = computed((): string | null =>
    normalizeTngSkeletonMessage(this.message()),
  );
  protected readonly normalizedMessages = computed((): readonly string[] =>
    normalizeTngSkeletonMessages(this.messages()),
  );
  protected readonly resolvedMessageMode = computed((): TngSkeletonMessageMode =>
    resolveTngSkeletonMessageMode(
      this.messageMode(),
      this.normalizedMessage(),
      this.normalizedMessages(),
    ),
  );
  protected readonly resolvedMessageStrategy = computed((): TngSkeletonMessageStrategy =>
    resolveTngSkeletonMessageStrategy(this.messageStrategy()),
  );
  protected readonly resolvedMessageInterval = computed((): number =>
    resolveTngSkeletonMessageInterval(this.messageInterval()),
  );
  protected readonly statusMessage = computed((): string | null => {
    if (this.resolvedMessageMode() === 'static') {
      return this.normalizedMessage();
    }

    if (this.resolvedMessageMode() === 'random') {
      return this.randomMessage();
    }

    return null;
  });
  protected readonly shouldRenderProjectedMessage = computed((): boolean =>
    this.resolvedMessageMode() === 'static' && this.normalizedMessage() === null,
  );

  constructor() {
    effect((onCleanup): void => {
      const mode = this.resolvedMessageMode();
      const messages = this.normalizedMessages();
      const strategy = this.resolvedMessageStrategy();
      const interval = this.resolvedMessageInterval();

      if (mode !== 'random' || messages.length === 0) {
        this.randomMessage.set(null);
        return;
      }

      const selectMessage = (): void => {
        this.randomMessage.set(selectRandomTngSkeletonMessage(messages));
      };

      selectMessage();

      if (strategy !== 'interval') {
        return;
      }

      const timer = setInterval(selectMessage, interval);
      onCleanup((): void => {
        clearInterval(timer);
      });
    });
  }

  resolveHeight(): string {
    return resolveTngSkeletonCssSize(this.height(), '1rem');
  }

  resolveWidth(): string {
    return resolveTngSkeletonCssSize(this.width(), '100%');
  }
}
`;

const skeletonTemplateHtml = `<div class="tng-skeleton-shell" [style.width]="resolveWidth()" [style.height]="resolveHeight()">
  <div
    tngSkeleton
    class="tng-skeleton"
    [animated]="animated()"
    [rounded]="rounded()"
    [style.width]="resolveWidth()"
    [style.height]="resolveHeight()"
  ></div>

  @if (statusMessage() !== null) {
    <span class="tng-skeleton-message" role="status" aria-live="polite">
      {{ statusMessage() }}
    </span>
  } @else if (shouldRenderProjectedMessage()) {
    <span class="tng-skeleton-message" role="status" aria-live="polite">
      <ng-content></ng-content>
    </span>
  }
</div>
`;

const skeletonTemplateCss = `:host {
  display: block;
}

.tng-skeleton-shell {
  position: relative;
  display: block;
}

.tng-skeleton {
  background: linear-gradient(90deg, #e2e8f0 0%, #cbd5e1 50%, #e2e8f0 100%);
  background-size: 220% 100%;
}

.tng-skeleton-message {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  overflow: hidden;
  padding: 0 0.75rem;
  color: #0f172a;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1;
  pointer-events: none;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tng-skeleton-message:empty {
  display: none;
}

.tng-skeleton[data-rounded='true'] {
  border-radius: 0.6rem;
}

.tng-skeleton[data-rounded='false'] {
  border-radius: 0;
}

.tng-skeleton[data-animated='true'] {
  animation: tng-skeleton-shimmer 1.3s linear infinite;
}

@keyframes tng-skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -20% 0;
  }
}
`;

const skeletonIndexTsTemplate = `export * from './tng-skeleton';
export * from './tng-skeleton-primitive';
`;

export const skeletonRegistryItem = {
  dependencies: [],
  description: 'Shadcn-style source files for skeleton primitive and wrapper.',
  install: {
    importPath: './tailng-ui/skeleton',
    importSymbols: ['TngSkeleton', 'TngSkeletonPrimitive'],
  },
  files: [
    {
      content: skeletonPrimitiveTsTemplate,
      path: 'src/app/tailng-ui/skeleton/tng-skeleton-primitive.ts',
    },
    {
      content: skeletonComponentTsTemplate,
      path: 'src/app/tailng-ui/skeleton/tng-skeleton.ts',
    },
    {
      content: skeletonTemplateHtml,
      path: 'src/app/tailng-ui/skeleton/tng-skeleton.html',
    },
    {
      content: skeletonTemplateCss,
      path: 'src/app/tailng-ui/skeleton/tng-skeleton.css',
    },
    {
      content: skeletonIndexTsTemplate,
      path: 'src/app/tailng-ui/skeleton/index.ts',
    },
  ],
  name: 'skeleton',
} satisfies RegistryItem;
