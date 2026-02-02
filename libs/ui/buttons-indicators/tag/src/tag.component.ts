import { Component, computed, input } from '@angular/core';

type TagColor = 'default' | 'primary' | 'success' | 'danger';

@Component({
  selector: 'tng-tag',
  standalone: true,
  templateUrl: './tag.component.html',
})
export class TailngTagComponent {
  label = input<string | null>('Text');
  disabled = input<boolean>(false);

  color = input<TagColor>('default');

  containerKlass = computed(() => {
    const base = 'flex items-center rounded-md px-3 py-1 text-xs font-bold';

    const disabledClass = this.disabled() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    const colorMap: Record<TagColor, string> = {
      default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      primary: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      success: 'bg-green-100 text-green-800 hover:bg-green-200',
      danger: 'bg-red-100 text-red-800 hover:bg-red-200',
    };

    return `${base} ${colorMap[this.color()]} ${disabledClass}`;
  });
}
 

