import { FC } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useBillWizard } from "../../hooks/useBillWizard";
import {
  useAuthContext,
  useCreateBillContext,
  useCreateBillNavigation,
  useCurrencies,
  useCurrencySelectData,
  useFormData,
  useSortedSelectData,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { FormData, Input, NavBar, Select } from "@/app/components";

export const BasicInfo: FC = () => {
  const { headerTitle, goNext, goBack, exitWizard } = useBillWizard();
  const translations = useTranslations();
  const navigation = useCreateBillNavigation();
  const { billData } = useCreateBillContext();
  const { userData } = useAuthContext();

  const totalAmountField = useFormData("");
  const currencyField = useFormData(billData.currency);
  const billNameField = useFormData("");
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

  const handleNext = () => {
    if (!isValid) {
      return;
    }

    // TODO: Before calling goNext(), save this data to your global CreateBillContext or Zustand store
    // e.g., setBillBasics({ name: billName, totalAmount: parsedAmount, currency, payerID });

    goNext();
  };

  const styles = useStyles();

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text={headerTitle}
          onBackPress={goBack}
        />
      }
    >
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
        </View>
      </ScrollView>
    </LayoutProvider>
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

export default BasicInfo;
