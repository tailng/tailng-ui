import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Directive,
  TemplateRef,
  computed,
  contentChildren,
  inject,
  input,
} from '@angular/core';
import { TngTabsComponent } from '@tailng-ui/components';
import { TngTab, TngTabList, TngTabPanel } from '@tailng-ui/primitives';
import {
  DocsExamplePanelComponent,
  type DocsExampleCodeTab,
} from '../example-panel/docs-example-panel.component';

@Directive({
  selector: 'ng-template[appDocsExampleVariant]',
})
export class DocsExampleVariantDirective {
  public readonly value = input.required<string>();
  public readonly label = input.required<string>();
  public readonly panelTitle = input.required<string>();
  public readonly codeTabs = input<readonly DocsExampleCodeTab[]>([]);
  public readonly codeVisibleByDefault = input<boolean>(false);
  public readonly stackblitzUrl = input<string | null>(null);
  public readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}

@Component({
  selector: 'app-docs-example-tabs-section',
  imports: [
    NgTemplateOutlet,
    TngTabsComponent,
    TngTabList,
    TngTab,
    TngTabPanel,
    DocsExamplePanelComponent,
  ],
  templateUrl: './docs-example-tabs-section.component.html',
  styleUrl: './docs-example-tabs-section.component.css',
})
export class DocsExampleTabsSectionComponent {
  public readonly heading = input<string>('Examples');
  public readonly description = input<string>('');
  public readonly ariaLabel = input<string>('Examples');
  public readonly tabListAriaLabel = input<string>('Example variants');
  public readonly defaultValue = input<string | null>(null);
  public readonly codeBlockTheme = input<'github-dark' | 'github-light'>('github-light');
  public readonly stackblitzUrl = input<string | null>(null);
  protected readonly variants = contentChildren(DocsExampleVariantDirective);
  protected readonly resolvedDefaultValue = computed<string>(() => {
    const configuredDefault = this.defaultValue()?.trim();
    if (configuredDefault !== undefined && configuredDefault !== '') {
      return configuredDefault;
    }

    return this.variants()[0]?.value() ?? '';
  });
}
