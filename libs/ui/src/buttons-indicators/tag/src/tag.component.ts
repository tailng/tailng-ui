import { Component, computed, input } from '@angular/core';

type TagColor = 'default' | 'primary' | 'success' | 'danger';

@Component({
  selector: 'tng-tag',
  standalone: true,
  templateUrl: './tag.component.html',
})
export class TailngTagComponent {
  text = input<string | null>('text');
  disabled = input<boolean>(false);

  color = input<TagColor>('default');

  rootKlass = computed(() => {
    const base = 'inline-flex items-center rounded px-3 py-1 text-sm font-medium border';

    const disabledClass = this.disabled() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    const colorMap: Record<TagColor, string> = {
      default: 'bg-gray-100 border-gray-300 text-gray-800',
      primary: 'bg-blue-100 border-blue-500 text-blue-800',
      success: 'bg-green-100 border-green-500 text-green-800',
      danger: 'bg-red-100 border-red-500 text-red-800',
    };

    return `${base} ${colorMap[this.color()]} ${disabledClass}`;
  });
}
 

