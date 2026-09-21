import { ScrollView, StyleSheet, View } from "react-native";
import { Button, FormData, Input, Select } from "@/app/components";
import {
  useAuthContext,
  useBillWizard,
  useCreateBillContext,
  useCurrencies,
  useCurrencySelectData,
  useFormData,
  useSortedSelectData,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";

export const BasicInfoForm = () => {
  const translations = useTranslations();
  const { userData } = useAuthContext();
  const { billData } = useCreateBillContext();
  const { goNext } = useBillWizard();

  const billNameField = useFormData(billData.name);
  const totalAmountField = useFormData("");
  const currencyField = useFormData(billData.currency);
  const payerIDField = useFormData(userData?._id || "");

  const { currencies } = useCurrencies();
  const currencySelectData = useCurrencySelectData(currencies);
  const sortedCurrencies = useSortedSelectData(
    currencySelectData,
    currencyField.value,
  );

  const parsedAmount = parseFloat(totalAmountField.value.replace(",", "."));
  const isValid =
    !isNaN(parsedAmount) &&
    parsedAmount > 0 &&
    billNameField.value.trim().length > 0 &&
    payerIDField.value !== "";

  const styles = useStyles();

  return (
    <ScrollView>
      <View style={styles.container}>
        <FormData labelText={translations["billName"]}>
          <Input
            text={billNameField.value}
            onChange={billNameField.setValue}
            placeholder="e.g., Dinner at Mario's"
          />
        </FormData>
        <FormData labelText={translations["totalAmount"]}>
          <Input
            text={totalAmountField.value}
            onChange={totalAmountField.setValue}
            placeholder="0.00"
            keyboardType="numeric"
          />
        </FormData>
        <FormData labelText={translations["billCurrency"]}>
          <Select
            selectData={sortedCurrencies}
            value={currencyField.value}
            onSelect={currencyField.setValue}
            activeSearch={true}
            searchPlaceholder={translations["searchCurrency"]}
          />
        </FormData>
        <Button
          text="NEXT"
          onPress={goNext}
        />
      </View>
    </ScrollView>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    container: {
      gap: theme.spacing(3),
    },
  });
};

export default BasicInfoForm;
