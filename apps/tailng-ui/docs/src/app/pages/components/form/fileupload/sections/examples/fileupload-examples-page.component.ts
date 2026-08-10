import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngFileUploadDirective } from '@tailng-ui/primitives';
import type { TngFileUploadRejectedEvent, TngFileUploadSelectedEvent } from '@tailng-ui/primitives';
import type { DocsExampleCodeTab } from '../../../../../../shared/example-panel/docs-example-panel.component';
import {
  DocsExampleTabsSectionComponent,
  DocsExampleVariantDirective,
} from '../../../../../../shared/example-tabs-section/docs-example-tabs-section.component';
import {
  observeDocsCodeThemeChanges,
  resolveDocsCodeBlockTheme,
} from '../../../../../../shared/util';

function createCodeTabs(
  baseName: string,
  tsCode: string,
  htmlCode: string,
  cssCode: string,
): readonly DocsExampleCodeTab[] {
  return Object.freeze([
    { value: 'ts', label: 'TS', language: 'ts', title: `${baseName}.component.ts`, code: tsCode },
    {
      value: 'html',
      label: 'HTML',
      language: 'html',
      title: `${baseName}.component.html`,
      code: htmlCode,
    },
    {
      value: 'css',
      label: 'CSS',
      language: 'css',
      title: `${baseName}.component.css`,
      code: cssCode,
    },
  ]);
}

type UploadedFile = Readonly<{ name: string; size: number; type: string }>;

@Component({
  selector: 'app-fileupload-examples-page',
  imports: [TngFileUploadDirective, DocsExampleTabsSectionComponent, DocsExampleVariantDirective],
  templateUrl: './fileupload-examples-page.component.html',
  styleUrl: './fileupload-examples-page.component.css',
})
export class FileUploadExamplesPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  /* --- Image-only drop zone state --- */
  protected readonly imageFilesPlain = signal<readonly UploadedFile[]>([]);
  protected readonly imageFilesRejectedPlain = signal<readonly string[]>([]);
  protected readonly imageFilesTailwind = signal<readonly UploadedFile[]>([]);
  protected readonly imageFilesRejectedTailwind = signal<readonly string[]>([]);

  /* --- Multi-file drop zone state --- */
  protected readonly multiFilesPlain = signal<readonly UploadedFile[]>([]);
  protected readonly multiFilesRejectedPlain = signal<readonly string[]>([]);
  protected readonly multiFilesTailwind = signal<readonly UploadedFile[]>([]);
  protected readonly multiFilesRejectedTailwind = signal<readonly string[]>([]);

  protected readonly imageOnlyPlainTabs = createCodeTabs(
    'fileupload-examples-image-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngFileUploadDirective } from '@tailng-ui/primitives';",
      "import type { TngFileUploadSelectedEvent, TngFileUploadRejectedEvent } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-fileupload-image-plain-css',",
      '  standalone: true,',
      '  imports: [TngFileUploadDirective],',
      "  templateUrl: './fileupload-image-plain-css.component.html',",
      "  styleUrl: './fileupload-image-plain-css.component.css',",
      '})',
      'export class FileUploadImagePlainCssComponent {',
      '  protected readonly files = signal<readonly File[]>([]);',
      '  protected readonly rejections = signal<readonly string[]>([]);',
      '',
      '  protected onSelected(e: TngFileUploadSelectedEvent): void {',
      '    this.files.set(e.files);',
      '    this.rejections.set([]);',
      '  }',
      '',
      '  protected onRejected(e: TngFileUploadRejectedEvent): void {',
      '    this.rejections.set(e.rejected.map((r) => `${r.file.name}: ${r.message}`));',
      '  }',
      '}',
    ].join('\n'),
    [
      '<div',
      '  class="image-drop-zone"',
      '  tngFileUpload',
      '  accept="image/*"',
      '  [multiple]="false"',
      '  (filesSelected)="onSelected($event)"',
      '  (filesRejected)="onRejected($event)"',
      '>',
      '  <span class="image-drop-zone-icon" aria-hidden="true">🖼</span>',
      '  <span class="image-drop-zone-label">Drop an image here</span>',
      '  <span class="image-drop-zone-hint">Single file · any image type</span>',
      '</div>',
      '@if (files().length > 0) {',
      '  <p class="upload-status">Accepted: {{ files()[0]?.name }}</p>',
      '}',
      '@if (rejections().length > 0) {',
      '  <ul class="upload-errors">',
      '    @for (msg of rejections(); track msg) {',
      '      <li>{{ msg }}</li>',
      '    }',
      '  </ul>',
      '}',
      '',
    ].join('\n'),
    [
      '.image-drop-zone {',
      '  align-items: center;',
      '  background: var(--tng-control-bg);',
      '  border: 2px dashed var(--tng-control-border);',
      '  border-radius: var(--tng-control-radius);',
      '  cursor: pointer;',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 0.25rem;',
      '  padding: 2.5rem 1.5rem;',
      '  text-align: center;',
      '  transition: var(--tng-transition-colors);',
      '}',
      '.image-drop-zone[data-dragging] {',
      '  background: color-mix(in srgb, var(--tng-control-accent) 8%, var(--tng-control-bg));',
      '  border-color: var(--tng-control-accent);',
      '}',
      '.image-drop-zone-icon { font-size: 2rem; line-height: 1; }',
      '.image-drop-zone-label { font-weight: 600; }',
      '.image-drop-zone-hint { color: var(--tng-semantic-foreground-secondary); font-size: 0.85rem; }',
      '.upload-status { font-size: 0.875rem; margin: 0.5rem 0 0; }',
      '.upload-errors { color: #ef4444; font-size: 0.85rem; list-style: disc; margin: 0.5rem 0 0; padding-left: 1.25rem; }',
    ].join('\n'),
  );

  protected readonly imageOnlyTailwindTabs = createCodeTabs(
    'fileupload-examples-image-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngFileUploadDirective } from '@tailng-ui/primitives';",
      "import type { TngFileUploadSelectedEvent, TngFileUploadRejectedEvent } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-fileupload-image-tailwind',",
      '  standalone: true,',
      '  imports: [TngFileUploadDirective],',
      "  templateUrl: './fileupload-image-tailwind.component.html',",
      '})',
      'export class FileUploadImageTailwindComponent {',
      '  protected readonly files = signal<readonly File[]>([]);',
      '  protected readonly rejections = signal<readonly string[]>([]);',
      '',
      '  protected onSelected(e: TngFileUploadSelectedEvent): void {',
      '    this.files.set(e.files);',
      '    this.rejections.set([]);',
      '  }',
      '',
      '  protected onRejected(e: TngFileUploadRejectedEvent): void {',
      '    this.rejections.set(e.rejected.map((r) => `${r.file.name}: ${r.message}`));',
      '  }',
      '}',
    ].join('\n'),
    [
      '<div',
      '  class="flex flex-col items-center gap-1 rounded-xl border-2 border-dashed border-tng-border-default p-10 text-center transition-colors cursor-pointer [&[data-dragging]]:border-tng-accent-primary [&[data-dragging]]:bg-tng-bg-muted"',
      '  tngFileUpload',
      '  accept="image/*"',
      '  [multiple]="false"',
      '  (filesSelected)="onSelected($event)"',
      '  (filesRejected)="onRejected($event)"',
      '>',
      '  <span class="text-3xl leading-none" aria-hidden="true">🖼</span>',
      '  <span class="font-semibold text-tng-fg-primary">Drop an image here</span>',
      '  <span class="text-sm text-tng-fg-secondary">Single file · any image type</span>',
      '</div>',
      '@if (files().length > 0) {',
      '  <p class="mt-2 text-sm text-tng-fg-primary">Accepted: {{ files()[0]?.name }}</p>',
      '}',
      '@if (rejections().length > 0) {',
      '  <ul class="mt-2 list-disc pl-5 text-sm text-red-500">',
      '    @for (msg of rejections(); track msg) { <li>{{ msg }}</li> }',
      '  </ul>',
      '}',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  protected readonly multiFilePlainTabs = createCodeTabs(
    'fileupload-examples-multi-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngFileUploadDirective } from '@tailng-ui/primitives';",
      "import type { TngFileUploadSelectedEvent, TngFileUploadRejectedEvent } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-fileupload-multi-plain-css',",
      '  standalone: true,',
      '  imports: [TngFileUploadDirective],',
      "  templateUrl: './fileupload-multi-plain-css.component.html',",
      "  styleUrl: './fileupload-multi-plain-css.component.css',",
      '})',
      'export class FileUploadMultiPlainCssComponent {',
      '  protected readonly files = signal<readonly File[]>([]);',
      '  protected readonly rejections = signal<readonly string[]>([]);',
      '',
      '  protected onSelected(e: TngFileUploadSelectedEvent): void {',
      '    this.files.update((existing) => [...existing, ...e.files]);',
      '    this.rejections.set([]);',
      '  }',
      '',
      '  protected onRejected(e: TngFileUploadRejectedEvent): void {',
      '    this.rejections.set(e.rejected.map((r) => `${r.file.name}: ${r.message}`));',
      '  }',
      '',
      '  protected clear(): void { this.files.set([]); }',
      '',
      '  protected formatSize(bytes: number): string {',
      '    if (bytes < 1024) return `${bytes} B`;',
      '    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;',
      '    return `${(bytes / 1048576).toFixed(1)} MB`;',
      '  }',
      '}',
    ].join('\n'),
    [
      '<div',
      '  class="multi-drop-zone"',
      '  tngFileUpload',
      '  accept=".pdf,.doc,.docx,.txt"',
      '  [multiple]="true"',
      '  [maxSize]="10485760"',
      '  (filesSelected)="onSelected($event)"',
      '  (filesRejected)="onRejected($event)"',
      '>',
      '  <span class="multi-drop-zone-label">Drop documents here</span>',
      '  <span class="multi-drop-zone-hint">PDF, DOC, DOCX, TXT · max 10 MB each</span>',
      '</div>',
      '@if (files().length > 0) {',
      '  <ul class="file-queue">',
      '    @for (file of files(); track file.name) {',
      '      <li class="file-queue-item">',
      '        <span class="file-queue-name">{{ file.name }}</span>',
      '        <span class="file-queue-size">{{ formatSize(file.size) }}</span>',
      '      </li>',
      '    }',
      '  </ul>',
      '  <button class="clear-btn" type="button" (click)="clear()">Clear all</button>',
      '}',
      '',
    ].join('\n'),
    [
      '.multi-drop-zone {',
      '  align-items: center;',
      '  background: var(--tng-control-bg);',
      '  border: 2px dashed var(--tng-control-border);',
      '  border-radius: var(--tng-control-radius);',
      '  cursor: pointer;',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 0.25rem;',
      '  padding: 2rem 1.5rem;',
      '  text-align: center;',
      '  transition: var(--tng-transition-colors);',
      '}',
      '.multi-drop-zone[data-dragging] {',
      '  background: color-mix(in srgb, var(--tng-control-accent) 8%, var(--tng-control-bg));',
      '  border-color: var(--tng-control-accent);',
      '}',
      '.multi-drop-zone-label { font-weight: 600; }',
      '.multi-drop-zone-hint { color: var(--tng-semantic-foreground-secondary); font-size: 0.85rem; }',
      '.file-queue { display: grid; gap: 0.4rem; list-style: none; margin: 0.75rem 0 0; padding: 0; }',
      '.file-queue-item { align-items: center; display: flex; font-size: 0.875rem; gap: 0.5rem; justify-content: space-between; }',
      '.file-queue-name { color: var(--tng-semantic-foreground-primary); font-weight: 500; }',
      '.file-queue-size { color: var(--tng-semantic-foreground-secondary); }',
      '.clear-btn { cursor: pointer; font-size: 0.8rem; margin-top: 0.5rem; }',
    ].join('\n'),
  );

  protected readonly multiFileTailwindTabs = createCodeTabs(
    'fileupload-examples-multi-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngFileUploadDirective } from '@tailng-ui/primitives';",
      "import type { TngFileUploadSelectedEvent, TngFileUploadRejectedEvent } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-fileupload-multi-tailwind',",
      '  standalone: true,',
      '  imports: [TngFileUploadDirective],',
      "  templateUrl: './fileupload-multi-tailwind.component.html',",
      '})',
      'export class FileUploadMultiTailwindComponent {',
      '  protected readonly files = signal<readonly File[]>([]);',
      '',
      '  protected onSelected(e: TngFileUploadSelectedEvent): void {',
      '    this.files.update((existing) => [...existing, ...e.files]);',
      '  }',
      '',
      '  protected clear(): void { this.files.set([]); }',
      '',
      '  protected formatSize(bytes: number): string {',
      '    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;',
      '    return `${(bytes / 1048576).toFixed(1)} MB`;',
      '  }',
      '}',
    ].join('\n'),
    [
      '<div class="flex flex-col gap-3 rounded-2xl border border-tng-border-subtle bg-tng-bg-surface p-4 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--tng-semantic-border-subtle)_55%,transparent)]">',
      '  <div',
      '    class="flex flex-col items-center gap-1 rounded-xl border-2 border-dashed border-tng-border-default p-8 text-center transition-colors cursor-pointer [&[data-dragging]]:border-tng-accent-primary [&[data-dragging]]:bg-tng-bg-muted"',
      '    tngFileUpload',
      '    accept=".pdf,.doc,.docx,.txt"',
      '    [multiple]="true"',
      '    [maxSize]="10485760"',
      '    (filesSelected)="onSelected($event)"',
      '  >',
      '    <span class="font-semibold text-tng-fg-primary">Drop documents here</span>',
      '    <span class="text-sm text-tng-fg-secondary">PDF, DOC, DOCX, TXT · max 10 MB</span>',
      '  </div>',
      '  @if (files().length > 0) {',
      '    <ul class="m-0 grid gap-1 p-0 list-none">',
      '      @for (file of files(); track file.name) {',
      '        <li class="flex items-center justify-between text-sm">',
      '          <span class="font-medium text-tng-fg-primary">{{ file.name }}</span>',
      '          <span class="text-tng-fg-secondary">{{ formatSize(file.size) }}</span>',
      '        </li>',
      '      }',
      '    </ul>',
      '    <button type="button" class="w-fit text-xs text-tng-fg-secondary underline" (click)="clear()">Clear all</button>',
      '  }',
      '</div>',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onImageSelected(scope: 'plain' | 'tailwind', e: TngFileUploadSelectedEvent): void {
    if (scope === 'plain') {
      this.imageFilesPlain.set(e.files.map((f) => ({ name: f.name, size: f.size, type: f.type })));
      this.imageFilesRejectedPlain.set([]);
    } else {
      this.imageFilesTailwind.set(
        e.files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
      );
      this.imageFilesRejectedTailwind.set([]);
    }
  }

  protected onImageRejected(scope: 'plain' | 'tailwind', e: TngFileUploadRejectedEvent): void {
    const messages = e.rejected.map((r) => `${r.file.name}: ${r.message}`);
    if (scope === 'plain') {
      this.imageFilesRejectedPlain.set(messages);
    } else {
      this.imageFilesRejectedTailwind.set(messages);
    }
  }

  protected onMultiSelected(scope: 'plain' | 'tailwind', e: TngFileUploadSelectedEvent): void {
    const mapped = e.files.map((f) => ({ name: f.name, size: f.size, type: f.type }));
    if (scope === 'plain') {
      this.multiFilesPlain.update((existing) => [...existing, ...mapped]);
      this.multiFilesRejectedPlain.set([]);
    } else {
      this.multiFilesTailwind.update((existing) => [...existing, ...mapped]);
      this.multiFilesRejectedTailwind.set([]);
    }
  }

  protected onMultiRejected(scope: 'plain' | 'tailwind', e: TngFileUploadRejectedEvent): void {
    const messages = e.rejected.map((r) => `${r.file.name}: ${r.message}`);
    if (scope === 'plain') {
      this.multiFilesRejectedPlain.set(messages);
    } else {
      this.multiFilesRejectedTailwind.set(messages);
    }
  }

  protected clearMulti(scope: 'plain' | 'tailwind'): void {
    if (scope === 'plain') {
      this.multiFilesPlain.set([]);
    } else {
      this.multiFilesTailwind.set([]);
    }
  }

  protected formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }
}
