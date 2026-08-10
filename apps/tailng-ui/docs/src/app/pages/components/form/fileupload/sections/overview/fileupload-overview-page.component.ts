import { DOCUMENT } from '@angular/common';
import { Component, inject, signal, type OnDestroy } from '@angular/core';
import { TngFileUploadDirective } from '@tailng-ui/primitives';
import { TngCodeBlockComponent } from '@tailng-ui/components';
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

@Component({
  selector: 'app-fileupload-overview-page',
  imports: [
    TngFileUploadDirective,
    TngCodeBlockComponent,
    DocsExampleTabsSectionComponent,
    DocsExampleVariantDirective,
  ],
  templateUrl: './fileupload-overview-page.component.html',
  styleUrl: './fileupload-overview-page.component.css',
})
export class FileUploadOverviewPageComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);

  public readonly codeBlockTheme = signal<'github-dark' | 'github-light'>(
    resolveDocsCodeBlockTheme(this.documentRef),
  );
  private readonly colorSchemeObserver = observeDocsCodeThemeChanges(
    this.documentRef,
    this.codeBlockTheme,
  );

  protected readonly importCode = "import { TngFileUploadDirective } from '@tailng-ui/primitives';";

  protected readonly usageCode = [
    '<div',
    '  tngFileUpload',
    '  accept=".png,.jpg,.pdf"',
    '  [multiple]="true"',
    '  [maxSize]="5 * 1024 * 1024"',
    '  (filesSelected)="onFilesSelected($event)"',
    '  (filesRejected)="onFilesRejected($event)"',
    '>',
    '  Drop files here or click to browse',
    '</div>',
    '',
  ].join('\n');

  protected readonly selectedFiles = signal<readonly File[]>([]);
  protected readonly rejectedCount = signal(0);

  protected readonly plainCodeTabs = createCodeTabs(
    'fileupload-overview-plain-css',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngFileUploadDirective } from '@tailng-ui/primitives';",
      "import type { TngFileUploadSelectedEvent, TngFileUploadRejectedEvent } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-fileupload-overview-plain-css',",
      '  standalone: true,',
      '  imports: [TngFileUploadDirective],',
      "  templateUrl: './fileupload-overview-plain-css.component.html',",
      "  styleUrl: './fileupload-overview-plain-css.component.css',",
      '})',
      'export class FileUploadOverviewPlainCssComponent {',
      '  protected readonly selectedFiles = signal<readonly File[]>([]);',
      '',
      '  protected onFilesSelected(event: TngFileUploadSelectedEvent): void {',
      '    this.selectedFiles.set(event.files);',
      '  }',
      '',
      '  protected onFilesRejected(event: TngFileUploadRejectedEvent): void {',
      '    console.warn(event.rejected);',
      '  }',
      '}',
    ].join('\n'),
    [
      '<div',
      '  class="drop-zone"',
      '  tngFileUpload',
      '  accept=".png,.jpg,.jpeg,.pdf"',
      '  [multiple]="true"',
      '  [maxSize]="5242880"',
      '  (filesSelected)="onFilesSelected($event)"',
      '  (filesRejected)="onFilesRejected($event)"',
      '>',
      '  <span class="drop-zone-label">Drop files here</span>',
      '  <span class="drop-zone-hint">PNG, JPG, PDF · max 5 MB</span>',
      '</div>',
      '@if (selectedFiles().length > 0) {',
      '  <ul class="file-list">',
      '    @for (file of selectedFiles(); track file.name) {',
      '      <li class="file-list-item">{{ file.name }}</li>',
      '    }',
      '  </ul>',
      '}',
      '',
    ].join('\n'),
    [
      '.drop-zone {',
      '  align-items: center;',
      '  background: var(--tng-control-bg);',
      '  border: 2px dashed var(--tng-control-border);',
      '  border-radius: var(--tng-control-radius);',
      '  cursor: pointer;',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 0.35rem;',
      '  padding: 2rem 1.5rem;',
      '  text-align: center;',
      '  transition: var(--tng-transition-colors);',
      '}',
      '',
      '.drop-zone[data-dragging] {',
      '  background: color-mix(in srgb, var(--tng-control-accent) 8%, var(--tng-control-bg));',
      '  border-color: var(--tng-control-accent);',
      '}',
      '',
      '.drop-zone-label { font-weight: 600; }',
      '.drop-zone-hint { color: var(--tng-semantic-foreground-secondary); font-size: 0.875rem; }',
      '',
      '.file-list { list-style: none; margin: 0.75rem 0 0; padding: 0; display: grid; gap: 0.35rem; }',
      '.file-list-item { font-size: 0.875rem; color: var(--tng-semantic-foreground-secondary); }',
    ].join('\n'),
  );

  protected readonly tailwindCodeTabs = createCodeTabs(
    'fileupload-overview-tailwind',
    [
      "import { Component, signal } from '@angular/core';",
      "import { TngFileUploadDirective } from '@tailng-ui/primitives';",
      "import type { TngFileUploadSelectedEvent, TngFileUploadRejectedEvent } from '@tailng-ui/primitives';",
      '',
      '@Component({',
      "  selector: 'app-fileupload-overview-tailwind',",
      '  standalone: true,',
      '  imports: [TngFileUploadDirective],',
      "  templateUrl: './fileupload-overview-tailwind.component.html',",
      '})',
      'export class FileUploadOverviewTailwindComponent {',
      '  protected readonly selectedFiles = signal<readonly File[]>([]);',
      '',
      '  protected onFilesSelected(event: TngFileUploadSelectedEvent): void {',
      '    this.selectedFiles.set(event.files);',
      '  }',
      '',
      '  protected onFilesRejected(event: TngFileUploadRejectedEvent): void {',
      '    console.warn(event.rejected);',
      '  }',
      '}',
    ].join('\n'),
    [
      '<div',
      '  class="flex flex-col items-center gap-1 rounded-xl border-2 border-dashed border-tng-border-default p-8 text-center transition-colors [&[data-dragging]]:border-tng-accent-primary [&[data-dragging]]:bg-tng-accent-primary/8"',
      '  tngFileUpload',
      '  accept=".png,.jpg,.jpeg,.pdf"',
      '  [multiple]="true"',
      '  [maxSize]="5242880"',
      '  (filesSelected)="onFilesSelected($event)"',
      '  (filesRejected)="onFilesRejected($event)"',
      '>',
      '  <span class="font-semibold text-tng-fg-primary">Drop files here</span>',
      '  <span class="text-sm text-tng-fg-secondary">PNG, JPG, PDF · max 5 MB</span>',
      '</div>',
      '@if (selectedFiles().length > 0) {',
      '  <ul class="mt-3 grid gap-1 p-0 list-none">',
      '    @for (file of selectedFiles(); track file.name) {',
      '      <li class="text-sm text-tng-fg-secondary">{{ file.name }}</li>',
      '    }',
      '  </ul>',
      '}',
      '',
    ].join('\n'),
    '/* Tailwind utilities are applied directly in the template. */',
  );

  public ngOnDestroy(): void {
    this.colorSchemeObserver?.disconnect();
  }

  protected onFilesSelected(event: { files: readonly File[] }): void {
    this.selectedFiles.set(event.files);
    this.rejectedCount.set(0);
  }

  protected onFilesRejected(event: { rejected: readonly unknown[] }): void {
    this.rejectedCount.set(event.rejected.length);
  }
}
