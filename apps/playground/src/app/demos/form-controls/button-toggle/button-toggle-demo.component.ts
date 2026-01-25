import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  TailngButtonToggleComponent,
  TailngButtonToggleOption,
} from '@tociva/tailng-ui';

@Component({
  selector: 'playground-button-toggle-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TailngButtonToggleComponent, JsonPipe],
  templateUrl: './button-toggle-demo.component.html',
})
export class ButtonToggleDemoComponent {
  
  /* =====================
   * Options
   * ===================== */

  sizeOptions: TailngButtonToggleOption<string>[] = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ];

  statusOptions: TailngButtonToggleOption<number>[] = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
    { value: 2, label: 'Archived', disabled: true },
  ];

  featureOptions: TailngButtonToggleOption<string>[] = [
    { value: 'wifi', label: 'Wi-Fi' },
    { value: 'bluetooth', label: 'Bluetooth' },
    { value: 'gps', label: 'GPS' },
  ];

  /* =====================
   * Reactive Forms (CVA)
   * ===================== */

  // Single selection
  sizeControl = new FormControl<string | null>('md');

  // Multiple selection
  featuresControl = new FormControl<string[]>(['wifi']);

  /* =====================
   * Direct mode (no forms)
   * ===================== */

  status: number | null = 1;
}
