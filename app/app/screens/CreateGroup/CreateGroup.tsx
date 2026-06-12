import {
  Button,
  FormData,
  Input,
  LoadingWrapper,
  NavBar,
  Scroll,
  Select,
} from "@/app/components";
import {
  useAppNavigation,
  useCurrencies,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useCreateGroup } from "./hooks";

export const CreateGroup: FC = () => {
  const translations = useTranslations();
  const navigation = useAppNavigation();

  const {
    nameField,
    descriptionField,
    currencyField,
    selectedMembers,
    handleCreateGroup,
    goToAddMembers,
  } = useCreateGroup();
  const { currencies, isLoading } = useCurrencies(currencyField.value);

  const styles = useStyles();

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text={translations["createGroup"]}
          onBackPress={navigation.goBack}
        />
      }
    >
      <LoadingWrapper isLoading={isLoading}>
        <Scroll>
          <View style={styles.inputs}>
            <FormData
              labelText={translations["groupName"]}
              messageText={nameField.error}
            >
              <Input
                text={nameField.value}
                placeholder={translations["groupName"] + "..."}
                onChange={nameField.setValue}
                variant={nameField.error ? "error" : "default"}
                allowClear={true}
              />
            </FormData>
            <FormData
              labelText={translations["groupDescription"]}
              messageText={descriptionField.error}
            >
              <Input
                text={descriptionField.value}
                placeholder={translations["groupDescription"] + "..."}
                onChange={descriptionField.setValue}
                variant={descriptionField.error ? "error" : "default"}
                allowClear={true}
              />
            </FormData>
            <FormData
              labelText={translations["defaultGroupCurrency"]}
              messageText={currencyField.error}
            >
              <Select
                selectData={currencies}
                value={currencyField.value}
                onSelect={currencyField.setValue}
                placeholder={translations["defaultGroupCurrency"] + "..."}
                activeSearch={true}
                searchPlaceholder={translations["searchCurrency"]}
                variant={currencyField.error ? "error" : "default"}
              />
            </FormData>
          </View>
          <View style={styles.buttons}>
            <Button
              text={translations["createGroup"]}
              onPress={handleCreateGroup}
            />
            <Button
              text={`${translations["addMembers"]} (${selectedMembers.length})`}
              variant="secondary"
              onPress={goToAddMembers}
            />
          </View>
        </Scroll>
      </LoadingWrapper>
    </LayoutProvider>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    inputs: { gap: theme.spacing(3) },
    buttons: { gap: theme.spacing(3) },
  });
};

export default CreateGroup;
