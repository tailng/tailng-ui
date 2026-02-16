import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TngSelect, TngSelectSlot, TngSlotMap } from '@tailng-ui/ui/form';

interface Country {
  code: string;
  name: string;
  dialCode: string;
}

@Component({
  selector: 'playground-select-demo',
  standalone: true,
  imports: [ReactiveFormsModule, TngSelect],
  templateUrl: './select-demo.component.html',
})
export class SelectDemoComponent {
  countries = signal<Country[]>([
    { code: 'IN', name: 'India', dialCode: '+91' },
    { code: 'AE', name: 'UAE', dialCode: '+971' },
    { code: 'US', name: 'United States', dialCode: '+1' },
    { code: 'UK', name: 'United Kingdom', dialCode: '+44' },
    { code: 'DE', name: 'Germany', dialCode: '+49' },
    { code: 'FR', name: 'France', dialCode: '+33' },
    { code: 'SG', name: 'Singapore', dialCode: '+65' },
    { code: 'JP', name: 'Japan', dialCode: '+81' },
    { code: 'KR', name: 'South Korea', dialCode: '+82' },
    { code: 'CN', name: 'China', dialCode: '+86' },
    { code: 'HK', name: 'Hong Kong', dialCode: '+852' },
    { code: 'TW', name: 'Taiwan', dialCode: '+886' },
    { code: 'MX', name: 'Mexico', dialCode: '+52' },
    { code: 'CA', name: 'Canada', dialCode: '+1' },
    { code: 'AU', name: 'Australia', dialCode: '+61' },
    { code: 'NZ', name: 'New Zealand', dialCode: '+64' },
    { code: 'SA', name: 'Saudi Arabia', dialCode: '+966' },
    { code: 'AE', name: 'UAE', dialCode: '+971' },
    { code: 'US', name: 'United States', dialCode: '+1' },
    { code: 'UK', name: 'United Kingdom', dialCode: '+44' },
    { code: 'DE', name: 'Germany', dialCode: '+49' },
    { code: 'FR', name: 'France', dialCode: '+33' },
  ]);

  // CVA value source
  readonly countryCtrl = new FormControl<Country | null>(null);

  lastCloseReason = signal<string>('-');
  lastCloseReason2 = signal<string>('-');

  /** Slot-based styling example */
  selectSlot: TngSlotMap<TngSelectSlot> = {
    triggerButton: 'border border-border rounded-md focus:ring-2 focus:ring-primary',
    overlayPanel: 'rounded-lg shadow-lg',
    optionActive: 'bg-primary/10',
  };

  selectSlot2: TngSlotMap<TngSelectSlot> = {
    overlayPanel: 'rounded-xl border border-primary',
    option: 'px-4 py-2',
    optionActive: 'bg-primary text-on-primary',
  };

  displayCountry = (c: Country) => `${c.name} (${c.dialCode})`;

  onClosed(reason: string) {
    this.lastCloseReason.set(reason);
    console.log('Select closed:', reason);
  }

  clear() {
    this.countryCtrl.setValue(null);
    this.countryCtrl.markAsDirty();
    this.countryCtrl.markAsTouched();
  }

  countries2 = signal<Country[]>([
    { code: 'IN', name: 'India', dialCode: '+91' },
    { code: 'AE', name: 'UAE', dialCode: '+971' },
    { code: 'US', name: 'United States', dialCode: '+1' },
    { code: 'UK', name: 'United Kingdom', dialCode: '+44' },
    { code: 'DE', name: 'Germany', dialCode: '+49' },
    { code: 'FR', name: 'France', dialCode: '+33' },
    { code: 'SG', name: 'Singapore', dialCode: '+65' },
    { code: 'JP', name: 'Japan', dialCode: '+81' },
    { code: 'KR', name: 'South Korea', dialCode: '+82' },
    { code: 'CN', name: 'China', dialCode: '+86' },
    { code: 'HK', name: 'Hong Kong', dialCode: '+852' },
    { code: 'TW', name: 'Taiwan', dialCode: '+886' },
    { code: 'MX', name: 'Mexico', dialCode: '+52' },
    { code: 'CA', name: 'Canada', dialCode: '+1' },
    { code: 'AU', name: 'Australia', dialCode: '+61' },
    { code: 'NZ', name: 'New Zealand', dialCode: '+64' },
    { code: 'SA', name: 'Saudi Arabia', dialCode: '+966' },
    { code: 'AE', name: 'UAE', dialCode: '+971' },
    { code: 'US', name: 'United States', dialCode: '+1' },
    { code: 'UK', name: 'United Kingdom', dialCode: '+44' },
    { code: 'DE', name: 'Germany', dialCode: '+49' },
    { code: 'FR', name: 'France', dialCode: '+33' },
  ]);

  // CVA value source
  readonly countryCtrl2 = new FormControl<Country | null>(null);

  displayCountry2 = (c: Country) => `${c.name} (${c.dialCode})`;

  onClosed2(reason: string) {
    this.lastCloseReason2.set(reason);
    console.log('Select closed:', reason);
  }

  clear2() {
    this.countryCtrl.setValue(null);
    this.countryCtrl2.markAsDirty();
    this.countryCtrl2.markAsTouched();
  }
}
