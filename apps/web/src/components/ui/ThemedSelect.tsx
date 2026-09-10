import Select, {
  type GroupBase,
  type MultiValue,
  type Props as ReactSelectProps,
  type StylesConfig,
} from "react-select";

export type SelectOption = {
  value: string;
  label: string;
};

type ThemedSelectProps = Omit<
  ReactSelectProps<SelectOption, false, GroupBase<SelectOption>>,
  "styles" | "theme" | "classNamePrefix"
> & {
  className?: string;
};

type ThemedMultiSelectProps = Omit<
  ReactSelectProps<SelectOption, true, GroupBase<SelectOption>>,
  "styles" | "theme" | "classNamePrefix" | "isMulti"
> & {
  className?: string;
};

const baseSelectStyles = {
  control: (base: Record<string, unknown>, state: { isFocused: boolean }) => ({
    ...base,
    minHeight: 42,
    borderRadius: 8,
    borderColor: state.isFocused ? "#e53935" : "#eceff3",
    backgroundColor: "#ffffff",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(229, 57, 53, 0.12)" : "none",
    cursor: "pointer",
    "&:hover": {
      borderColor: state.isFocused ? "#e53935" : "#d7dbe2",
    },
  }),
  valueContainer: (base: Record<string, unknown>) => ({
    ...base,
    padding: "4px 12px",
    gap: 4,
  }),
  placeholder: (base: Record<string, unknown>) => ({
    ...base,
    color: "#6b7280",
    fontSize: 14,
  }),
  singleValue: (base: Record<string, unknown>) => ({
    ...base,
    color: "#171717",
    fontSize: 14,
    fontWeight: 500,
  }),
  multiValue: (base: Record<string, unknown>) => ({
    ...base,
    backgroundColor: "rgba(229, 57, 53, 0.1)",
    borderRadius: 6,
  }),
  multiValueLabel: (base: Record<string, unknown>) => ({
    ...base,
    color: "#e53935",
    fontSize: 12,
    fontWeight: 600,
    padding: "2px 4px",
  }),
  multiValueRemove: (base: Record<string, unknown>) => ({
    ...base,
    color: "#e53935",
    cursor: "pointer",
    borderRadius: 6,
    ":hover": {
      backgroundColor: "#e53935",
      color: "#ffffff",
    },
  }),
  input: (base: Record<string, unknown>) => ({
    ...base,
    color: "#171717",
    margin: 0,
    padding: 0,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base: Record<string, unknown>, state: { isFocused: boolean }) => ({
    ...base,
    color: state.isFocused ? "#e53935" : "#6b7280",
    padding: "0 10px",
    cursor: "pointer",
    "&:hover": {
      color: "#e53935",
    },
  }),
  clearIndicator: (base: Record<string, unknown>) => ({
    ...base,
    color: "#6b7280",
    padding: "0 4px",
    cursor: "pointer",
    "&:hover": {
      color: "#e53935",
    },
  }),
  menu: (base: Record<string, unknown>) => ({
    ...base,
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #eceff3",
    boxShadow: "0 12px 32px -16px rgba(17, 24, 39, 0.35)",
    zIndex: 40,
  }),
  menuPortal: (base: Record<string, unknown>) => ({
    ...base,
    zIndex: 80,
  }),
  menuList: (base: Record<string, unknown>) => ({
    ...base,
    padding: 6,
    maxHeight: 240,
  }),
  option: (
    base: Record<string, unknown>,
    state: { isSelected: boolean; isFocused: boolean },
  ) => ({
    ...base,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: state.isSelected ? 600 : 500,
    cursor: "pointer",
    backgroundColor: state.isSelected ? "#e53935" : state.isFocused ? "#f3f4f6" : "transparent",
    color: state.isSelected ? "#ffffff" : "#171717",
    ":active": {
      backgroundColor: state.isSelected ? "#c62828" : "#eceff3",
    },
  }),
  noOptionsMessage: (base: Record<string, unknown>) => ({
    ...base,
    color: "#6b7280",
    fontSize: 14,
  }),
};

const selectStyles = baseSelectStyles as StylesConfig<SelectOption, false>;
const multiSelectStyles = baseSelectStyles as StylesConfig<SelectOption, true>;

export function ThemedSelect(props: ThemedSelectProps) {
  const { className, isSearchable = true, ...rest } = props;

  return (
    <Select
      {...rest}
      isSearchable={isSearchable}
      className={className}
      classNamePrefix="buzaao-select"
      styles={selectStyles}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      menuPosition="fixed"
    />
  );
}

export function ThemedMultiSelect(props: ThemedMultiSelectProps) {
  const { className, isSearchable = true, closeMenuOnSelect = false, ...rest } = props;

  return (
    <Select
      {...rest}
      isMulti
      isSearchable={isSearchable}
      closeMenuOnSelect={closeMenuOnSelect}
      hideSelectedOptions={false}
      className={className}
      classNamePrefix="buzaao-select"
      styles={multiSelectStyles}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      menuPosition="fixed"
    />
  );
}

export function toSelectOptions(
  items: Array<{ id: string; name: string }>,
  allLabel?: string,
): SelectOption[] {
  const options = items.map((item) => ({ value: item.id, label: item.name }));
  return allLabel ? [{ value: "", label: allLabel }, ...options] : options;
}

export function findSelectOption(options: SelectOption[], value: string): SelectOption | null {
  return options.find((option) => option.value === value) ?? null;
}

export function findSelectOptions(options: SelectOption[], values: string[]): SelectOption[] {
  const valueSet = new Set(values);
  return options.filter((option) => valueSet.has(option.value));
}

export function multiValuesToIds(values: MultiValue<SelectOption> | null): string[] {
  return (values ?? []).map((option) => option.value);
}
