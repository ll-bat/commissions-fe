import { Autocomplete, Icon } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { useState, useCallback, useEffect, type FC } from "react";
import OrdersService from "@/app/views/orders/OrdersService";
import { getFirstError, showAlert } from "@/app/utils";

const StaffMembersAutocomplete: FC<{
  onSelect: (staffMemberId: string) => void;
}> = ({ onSelect }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [options, setOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [filteredOptions, setFilteredOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    OrdersService.getStaffMembers().then(({ ok, result, errors }) => {
      if (ok) {
        const staffMembersOptions = result!.map((staffMember) => ({
          value: String(staffMember.id),
          label: staffMember.fullName,
        }));
        setOptions(staffMembersOptions);
        setFilteredOptions(staffMembersOptions);
      } else {
        showAlert(false, getFirstError(errors));
      }
    });
  }, []);

  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);

      if (value === "") {
        setFilteredOptions(options);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions = options.filter((option) =>
        option.label.match(filterRegex),
      );
      setFilteredOptions(resultOptions);
    },
    [options],
  );

  const updateSelection = useCallback(
    (selected: string[]) => {
      const selectedValue = selected.map((selectedItem) => {
        const matchedOption = filteredOptions.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption?.label;
      });

      setSelectedOptions(selected);
      setInputValue(selectedValue[0] ?? "");
      onSelect(selected[0]);
    },
    [filteredOptions, onSelect],
  );

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="Staff members"
      value={inputValue}
      prefix={<Icon source={SearchIcon} tone="base" />}
      placeholder="Search"
      autoComplete="off"
    />
  );

  return (
    <div style={{ height: "225px" }}>
      <Autocomplete
        options={filteredOptions}
        selected={selectedOptions}
        onSelect={updateSelection}
        textField={textField}
      />
    </div>
  );
};

export default StaffMembersAutocomplete;
