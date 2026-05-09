import React, { FC, useCallback, useEffect, useState } from "react";
import {
  faChevronDown,
  faChevronUp,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { StyleSheet, View } from "react-native";
import { Typography } from "../Typography/Typography";
import { Dropdown } from "react-native-element-dropdown";
import { useThemeContext } from "@/app/hooks";
import { Icon } from "../Icon";
import { AppTheme } from "@/app/constants/theme";
import { SelectData } from "@/app/types";
import { Input } from "../Input";

export type SelectProps = {
  selectData: Array<SelectData>;
  value: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  variant?: "default" | "error";
  activeSearch?: boolean;
};

export const Select: FC<SelectProps> = ({
  selectData,
  value,
  onSelect,
  disabled = false,
  placeholder = "",
  searchPlaceholder = "",
  variant = "default",
  activeSearch = false,
}) => {
  const theme = useThemeContext();
  const [type, setType] = useState<SelectProps["variant"] | "active">(variant);
  const [searchQuery, setSearchQuery] = useState("");

  const styles = useStyles(theme, disabled, type);

  const onFocusInput = useCallback(() => {
    setType("active");
  }, []);

  const onBlurInput = useCallback(() => {
    setType("default");
    setSearchQuery("");
  }, []);

  useEffect(() => {
    setType(variant);
  }, [variant]);

  return (
    <Dropdown
      style={styles.dropdown}
      data={selectData}
      disable={disabled}
      labelField="label"
      valueField="value"
      placeholder={type === "active" ? "" : placeholder}
      placeholderStyle={styles.placeholder}
      value={value}
      onFocus={onFocusInput}
      onBlur={onBlurInput}
      onChange={(item: SelectData) => {
        onSelect(item.value);
        onBlurInput();
      }}
      renderItem={(item: SelectData) => {
        const background =
          value !== item.value ? "background-primary" : "text-success";

        return (
          <View
            style={[
              styles.option,
              { backgroundColor: theme.colors[background] },
            ]}
          >
            <Typography
              variant="body-large"
              text={item.label}
              color={disabled ? "background-disabled" : "text-primary"}
            />
          </View>
        );
      }}
      selectedTextStyle={styles.selectedText}
      containerStyle={styles.optionsContainer}
      activeColor="transparent"
      renderRightIcon={() => (
        <Icon
          icon={type === "active" ? faChevronUp : faChevronDown}
          size="large"
          color={disabled ? "text-disabled" : "text-primary"}
        />
      )}
      search={activeSearch}
      renderInputSearch={(onSearch) => {
        return (
          <View style={styles.search}>
            <Input
              placeholder={searchPlaceholder}
              text={searchQuery}
              onChange={(text) => {
                setSearchQuery(text);
                onSearch(text);
              }}
              beginIcon={faSearch}
              allowClear={true}
            />
          </View>
        );
      }}
    />
  );
};

const useStyles = (
  theme: AppTheme,
  disabled: SelectProps["disabled"],
  type: SelectProps["variant"] | "active",
) => {
  const borderColor =
    type === "default"
      ? "text-secondary"
      : type === "active"
        ? "text-success"
        : type === "error"
          ? "text-error"
          : "text-secondary";
  const selectedText = disabled ? "text-disabled" : "text-primary";
  const placeholderText = disabled ? "text-disabled" : "text-secondary";

  return StyleSheet.create({
    dropdown: {
      borderWidth: 1,
      borderColor: theme.colors[borderColor],
      paddingHorizontal: theme.spacing(4),
      paddingVertical: theme.spacing(2),
      borderRadius: theme.spacing(2),
    },
    placeholder: {
      textTransform: "capitalize",
      color: theme.colors[placeholderText],
    },
    optionsContainer: {
      borderWidth: 0,
      backgroundColor: theme.colors["background-secondary"],
    },
    option: {
      marginTop: 1,
      padding: theme.spacing(2),
      borderRadius: theme.spacing(2),
    },
    selectedText: {
      color: theme.colors[selectedText],
    },
    search: {
      marginBottom: theme.spacing(2),
    },
  });
};

export default Select;
