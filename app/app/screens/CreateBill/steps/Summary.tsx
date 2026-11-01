import React, { useMemo } from "react";
import { StyleSheet, View, DeviceEventEmitter } from "react-native";
import { useBillWizard } from "../../../hooks/useBillWizard";
import {
  useConfirmContext,
  useCreateBillContext,
  useCurrencies,
  useThemeContext,
  useTranslations,
  useLoadingContext,
  useAuthenticatedApi, // Ensure this hook provides showLoading / hideLoading
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { Button, ListItem, NavBar, Scroll, Typography } from "@/app/components";
import { createBillCall } from "@/app/services";

export const Summary = () => {
  const translations = useTranslations();
  const { showConfirm } = useConfirmContext();
  const { showLoading, hideLoading } = useLoadingContext();
  const request = useAuthenticatedApi();
  const { billData, billForm, groupID } = useCreateBillContext();
  const { headerTitle, goNext, goBack, exitWizard, isLastStep } =
    useBillWizard();
  const { currencies } = useCurrencies();

  const currencySymbol = useMemo(() => {
    const selectedCurrency = currencies.find(
      (currency) => currency.code === billForm.currencyField.value,
    );
    return selectedCurrency ? selectedCurrency.symbol : "";
  }, [currencies, billForm.currencyField.value]);

  const sharedPositions = billData.positions.filter((p) => p.isSharedByAll);
  const individualPositions = billData.positions.filter(
    (p) => !p.isSharedByAll,
  );

  const handleDiscardBill = () => {
    showConfirm({
      title: translations["discardBill"],
      message: translations["discardBillQuestion"],
      confirmText: translations["confirm"],
      isDestructive: true,
      onConfirm: exitWizard,
    });
  };

  const handleCreateBill = async () => {
    showLoading(translations["creatingBill"]);

    try {
      const response = await request(
        createBillCall,
        groupID,
        billForm.billNameField.value,
        parseFloat(billForm.totalAmountField.value),
        billForm.currencyField.value,
        billData.positions,
      );

      if (response.ok) {
        DeviceEventEmitter.emit("refreshBillList");
        exitWizard();
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      hideLoading();
    }
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
      <View style={styles.headerSection}>
        <Typography
          text={billForm.billNameField.value}
          variant="header-large"
        />

        <Typography
          text={`${translations["totalAmount"]}: ${parseFloat(billForm.totalAmountField.value).toFixed(2)} ${currencySymbol}`}
          variant="header-small"
          color="text-primary"
        />
      </View>

      <Scroll keyboardPersist="never">
        {sharedPositions.length > 0 && (
          <View style={styles.sectionContainer}>
            <Typography
              text={translations["sharedByEveryone"]}
              variant="body-small"
              color="text-secondary"
            />

            <View style={styles.listWrapper}>
              {sharedPositions.map((position, i) => {
                const lineTotal = (
                  position.unitPrice * position.quantity
                ).toFixed(2);

                return (
                  <ListItem
                    key={`Shared/${i}`}
                    onPress={() => {}}
                  >
                    <View style={styles.itemLeft}>
                      <Typography text={position.name} />

                      <Typography
                        text={`${position.quantity} ${translations["multiplier"]} ${position.unitPrice.toFixed(2)} ${currencySymbol}`}
                        variant="body-small"
                        color="text-secondary"
                      />
                    </View>

                    <View style={styles.itemRight}>
                      <Typography
                        text={`${lineTotal} ${currencySymbol}`}
                        variant="header-small"
                      />
                    </View>
                  </ListItem>
                );
              })}
            </View>
          </View>
        )}

        {individualPositions.length > 0 && (
          <View style={styles.sectionContainer}>
            <Typography
              text={translations["individualItems"]}
              variant="body-small"
              color="text-secondary"
            />

            <View style={styles.listWrapper}>
              {individualPositions.map((position, i) => {
                const lineTotal = (
                  position.unitPrice * position.quantity
                ).toFixed(2);

                return (
                  <ListItem
                    key={`Individual/${i}`}
                    onPress={() => {}}
                  >
                    <View style={styles.itemLeft}>
                      <Typography text={position.name} />

                      <Typography
                        text={`${position.quantity} ${translations["multiplier"]} ${position.unitPrice.toFixed(2)} ${currencySymbol}`}
                        variant="body-small"
                        color="text-secondary"
                      />
                    </View>

                    <View style={styles.itemRight}>
                      <Typography
                        text={`${lineTotal} ${currencySymbol}`}
                        variant="header-small"
                      />
                    </View>
                  </ListItem>
                );
              })}
            </View>
          </View>
        )}
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
          onPress={isLastStep ? handleCreateBill : goNext}
          fullWidth
        />
      </View>
    </LayoutProvider>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    headerSection: {
      alignItems: "center",
      gap: theme.spacing(1),
    },
    sectionContainer: {
      gap: theme.spacing(1),
    },
    listWrapper: {
      gap: theme.spacing(1),
    },
    itemLeft: {
      flex: 1,
      gap: theme.spacing(0.5),
    },
    itemRight: {
      justifyContent: "center",
    },
    bottomActions: {
      flexDirection: "row",
      gap: theme.spacing(3),
    },
  });
};

export default Summary;
