import { PropType, ComputedRef, ExtractPropTypes, Ref, SetupContext } from 'vue';

export interface OptionObjectItem {
  name: string;
  value: string | number;
  _checked: boolean;
  [key: string]: unknown;
}

export type OptionItem = number | string | ({ value: string | number } & Partial<OptionObjectItem>);
export type Options = Array<OptionItem>;

export type ModelValue = number | string | Array<number | string>;
export type filterVale = boolean | ((query: string, callback?: () => void) => void);
export const selectProps = {
  modelValue: {
    type: [String, Number, Array] as PropType<ModelValue>,
    default: '',
  },
  'onUpdate:modelValue': {
    type: Function as PropType<(val: ModelValue) => void>,
    default: undefined,
  },
  options: {
    type: Array as PropType<Options>,
    default: () => [],
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    default: 'md',
  },
  overview: {
    type: String as PropType<'border' | 'underlined'>,
    default: 'border',
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  allowClear: {
    type: Boolean,
    default: false,
  },
  optionDisabledKey: {
    type: String,
    default: '',
  },
  collapseTags: {
    type: Boolean,
    default: false,
  },
  collapseTagsTooltip: {
    type: Boolean,
    default: false,
  },
  filter: {
    type: [Boolean, Function] as PropType<filterVale>,
    default: false,
  },
  remote: {
    type: Boolean,
    default: false,
  },
  onToggleChange: {
    type: Function as PropType<(bool: boolean) => void>,
    default: undefined,
  },
  onValueChange: {
    type: Function as PropType<(item: OptionItem, index: number) => void>,
    default: undefined,
  },
} as const;

export type SelectProps = ExtractPropTypes<typeof selectProps>;

export type OptionModelValue = number | string;

export interface UseSelectReturnType {
  containerRef: Ref<HTMLElement | undefined>;
  dropdownRef: Ref<HTMLElement | undefined>;
  isOpen: Ref<boolean>;
  selectCls: ComputedRef<string>;
  mergeOptions: ComputedRef<OptionObjectItem[]>;
  inputValue: ComputedRef<string>;
  selectedOptions: Ref<OptionObjectItem[]>;
  filterQuery: Ref<string>;
  onClick: (e: MouseEvent) => void;
  handleClear: (e: MouseEvent) => void;
  valueChange: (item: OptionObjectItem, isObjectOption: boolean) => void;
  handleClose: () => void;
  updateInjectOptions: (item: Record<string, unknown>, operation: string) => void;
  tagDelete: (data: OptionObjectItem) => void;
  onFocus: (e: FocusEvent) => void;
  onBlur: (e: FocusEvent) => void;
  debounceQueryFilter: (query: string) => void;
}

export interface SelectContext extends SelectProps {
  isOpen: boolean;
  selectedOptions: OptionObjectItem[];
  filterQuery: string;
  valueChange: (item: OptionObjectItem, isObjectOption: boolean) => void;
  handleClear: () => void;
  updateInjectOptions: (item: Record<string, unknown>, operation: string) => void;
  tagDelete: (data: OptionObjectItem) => void;
  onFocus: (e: FocusEvent) => void;
  onBlur: (e: FocusEvent) => void;
  debounceQueryFilter: (query: string) => void;
}

export const optionProps = {
  value: {
    type: [String, Number] as PropType<OptionModelValue>,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
};

export type OptionProps = ExtractPropTypes<typeof optionProps>;

export interface UseOptionReturnType {
  currentName: ComputedRef<OptionModelValue>;
  selectOptionCls: ComputedRef<string>;
  isVisible: ComputedRef<boolean>;
  optionSelect: () => void;
}

export const selectContentProps = {
  value: {
    type: String,
    default: '',
  },
};

export type SelectContentProps = ExtractPropTypes<typeof selectContentProps>;

export interface UseSelectContentReturnType {
  searchQuery: Ref<string>;
  selectedData: ComputedRef<OptionObjectItem[]>;
  isSelectDisable: ComputedRef<boolean>;
  isSupportCollapseTags: ComputedRef<boolean>;
  isSupportTagsTooltip: ComputedRef<boolean>;
  isDisabledTooltip: ComputedRef<boolean>;
  isReadOnly: ComputedRef<boolean>;
  selectionCls: ComputedRef<string>;
  inputCls: ComputedRef<string>;
  placeholder: ComputedRef<string>;
  isMultiple: ComputedRef<boolean>;
  handleClear: (e: MouseEvent) => void;
  tagDelete: (data: OptionObjectItem) => void;
  onFocus: (e: FocusEvent) => void;
  onBlur: (e: FocusEvent) => void;
  queryFilter: (e: Event) => void;
}
