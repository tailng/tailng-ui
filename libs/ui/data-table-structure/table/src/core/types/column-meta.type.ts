export type TailngEnumOption = { value: string; label: string };

export type TailngColumnFilterMeta =
  | { type: 'text'; placeholder?: string }
  | { type: 'number' }
  | { type: 'date' }
  | { type: 'enum'; options: TailngEnumOption[] };

export type TailngColumnMeta = {
  id: string;
  label?: string;
  filter?: TailngColumnFilterMeta;
};
