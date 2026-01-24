import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { docsNav } from '../../data/nav';
import {
  TailngAccordionComponent,
  TailngExpansionPanelComponent,
  TailngSidenavComponent,
  TailngTextInputComponent,
} from '@tailng/ui';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'docs-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TailngAccordionComponent,
    TailngExpansionPanelComponent,
    TailngSidenavComponent,
    TailngTextInputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './docs-shell.component.html',
})
export class DocsShellComponent implements OnInit {
  mobileOpen = signal(false);
  nav = computed(() => docsNav);
searchQuery = signal<string>('');
  
   form = new FormGroup({
    text: new FormControl(''),
  });
ngOnInit() {
  this.form.controls.text.valueChanges.subscribe(value => {
    this.searchQuery.set(value ?? '');
  });
}
normalizedQuery = computed(() =>
  this.searchQuery().toLowerCase().trim()
);
filteredNav() {
  const q = this.normalizedQuery();
  return this.nav().filter(section =>
    section.title.toLowerCase().includes(q) ||
    section.children?.some(child =>
      child.title?.toLowerCase().includes(q)
    )
  );
}

}
