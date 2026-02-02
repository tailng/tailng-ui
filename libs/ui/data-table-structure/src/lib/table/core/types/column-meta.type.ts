export type TngEnumOption = { value: string; label: string };

export type TngColumnFilterMeta =
  | { type: 'text'; placeholder?: string }
  | { type: 'number' }
  | { type: 'date' }
  | { type: 'enum'; options: TngEnumOption[] };

export type TngColumnMeta = {
  id: string;
  label?: string;
  filter?: TngColumnFilterMeta;
};
