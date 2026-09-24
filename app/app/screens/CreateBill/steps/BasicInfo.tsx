import { StyleSheet, View } from "react-native";
import { useBillWizard } from "../../../hooks/useBillWizard";
import {
  useCreateBillContext,
  useCurrencies,
  useCurrencySelectData,
  useSortedSelectData,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import {
  Button,
  FormData,
  Input,
  LoadingWrapper,
  NavBar,
  Scroll,
  Select,
  Typography,
} from "@/app/components";
import { formatDecimalInput } from "@/app/utils";
import { useMemo } from "react";

export const BasicInfo = () => {
  const translations = useTranslations();
  const { billForm, members, isLoading } = useCreateBillContext();

  const { headerTitle, goNext, goBack, exitWizard, isLastStep } =
    useBillWizard();

  const { currencies } = useCurrencies();
  const currencySelectData = useCurrencySelectData(currencies);
  const sortedCurrencies = useSortedSelectData(
    currencySelectData,
    billForm.currencyField.value,
  );

  const payerSelectData = useMemo(() => {
    return members.map((member) => ({
      label: member.username,
      value: member._id,
    }));
  }, [members]);

  const getCurrencySymbol = () => {
    const selectedCurrency = currencies.find(
      (currency) => currency.code === billForm.currencyField.value,
    );

    return selectedCurrency ? selectedCurrency.symbol : "";
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
      <LoadingWrapper isLoading={isLoading}>
        <Scroll>
          <View style={styles.container}>
            <FormData labelText={translations["billName"]}>
              <Input
                text={billForm.billNameField.value}
                onChange={billForm.billNameField.setValue}
                placeholder="e.g., Dinner at Mario's"
              />
            </FormData>

            <FormData labelText={translations["totalAmount"]}>
              <View style={styles.currencyContainer}>
                <View style={styles.currencyNumber}>
                  <Input
                    text={billForm.totalAmountField.value}
                    onChange={(value) =>
                      formatDecimalInput(
                        billForm.totalAmountField.setValue,
                        value,
                        2,
                      )
                    }
                    placeholder="0.00"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.currencySymbol}>
                  <Typography
                    text={getCurrencySymbol()}
                    variant="header-large"
                  />
                </View>
              </View>
            </FormData>

            <FormData labelText={translations["billCurrency"]}>
              <Select
                selectData={sortedCurrencies}
                value={billForm.currencyField.value}
                onSelect={billForm.currencyField.setValue}
                activeSearch={true}
                searchPlaceholder={translations["searchCurrency"]}
              />
            </FormData>

            <FormData labelText={translations["paidBy"]}>
              <Select
                selectData={payerSelectData}
                value={billForm.payerIDField.value}
                onSelect={billForm.payerIDField.setValue}
                activeSearch={false}
              />
            </FormData>
          </View>
        </Scroll>

        <Button
          text={
            isLastStep ? translations["createBill"] : translations["nextStep"]
          }
          onPress={isLastStep ? exitWizard : goNext}
        />
      </LoadingWrapper>
    </LayoutProvider>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    container: {
      gap: theme.spacing(3),
    },
    currencyContainer: { flexDirection: "row", alignItems: "center" },
    currencyNumber: { flex: 6 },
    currencySymbol: { flex: 2, alignItems: "center" },
  });
};

export default BasicInfo;
