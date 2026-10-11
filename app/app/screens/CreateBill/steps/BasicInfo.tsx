import { StyleSheet, View } from "react-native";
import { useBillWizard } from "../../../hooks/useBillWizard";
import {
  useConfirmContext,
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
  const { showConfirm } = useConfirmContext();

  const { billForm, members, isLoading, setBasicInfo } = useCreateBillContext();
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

  const handleNext = () => {
    setBasicInfo(
      billForm.billNameField.value,
      parseFloat(billForm.totalAmountField.value),
      billForm.currencyField.value,
      billForm.payerIDField.value,
    );

    goNext();
  };

  const handleDiscardBill = () => {
    showConfirm({
      title: translations["discardBill"],
      message: translations["discardBillQuestion"],
      confirmText: translations["confirm"],
      isDestructive: true,
      onConfirm: exitWizard,
    });
  };

  const isNextDisabled =
    billForm.billNameField.value === "" ||
    billForm.totalAmountField.value === "" ||
    parseFloat(billForm.totalAmountField.value) <= 0 ||
    billForm.currencyField.value === "" ||
    billForm.payerIDField.value === "";

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
                placeholder={translations["billNamePlaceholder"]}
              />
            </FormData>

            <FormData labelText={translations["totalAmount"]}>
              <View style={styles.currencyContainer}>
                <View style={styles.currencyNumber}>
                  <Input
                    text={billForm.totalAmountField.value}
                    onChange={(value) => {
                      const formattedText = formatDecimalInput(
                        value,
                        billForm.totalAmountField.value,
                        2,
                      );

                      billForm.totalAmountField.setValue(formattedText);
                    }}
                    placeholder={translations["floatPlaceholder"]}
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

        <View style={styles.bottomActions}>
          <Button
            text={translations["discardBill"]}
            onPress={handleDiscardBill}
            variant="destructive"
            fullWidth
          />

          <Button
            text={
              isLastStep ? translations["createBill"] : translations["nextStep"]
            }
            onPress={isLastStep ? exitWizard : handleNext}
            disabled={isNextDisabled}
            fullWidth
          />
        </View>
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
    bottomActions: {
      flexDirection: "row",
      gap: theme.spacing(3),
    },
  });
};

export default BasicInfo;
