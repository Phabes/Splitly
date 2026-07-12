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
import { useEditGroupForm } from "./hooks";
import { RouteProp, useRoute } from "@react-navigation/native";
import { AppStackParamList } from "@/app/navigation/AppNavigation/AppNavigationProps";

export const EditGroup: FC = () => {
  const translations = useTranslations();
  const navigation = useAppNavigation();

  const route = useRoute<RouteProp<AppStackParamList, "EditGroup">>();
  const { _id: groupID, name, description, baseCurrency } = route.params;

  const {
    nameField,
    descriptionField,
    currencyField,
    editGroupButtonDisabled,
    handleEditGroup,
  } = useEditGroupForm(groupID, name, description, baseCurrency);

  const { currencies, isLoading } = useCurrencies(currencyField.value);

  const styles = useStyles();

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text={translations["editGroup"]}
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
              text={translations["editGroup"]}
              disabled={editGroupButtonDisabled}
              onPress={handleEditGroup}
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

export default EditGroup;
