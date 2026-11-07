import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import {
  useBillWizard,
  useConfirmContext,
  useCreateBillContext,
  useCurrencies,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import {
  Button,
  Checkbox,
  ListItem,
  NavBar,
  Scroll,
  Typography,
} from "@/app/components";

export const SharedPositions = () => {
  const translations = useTranslations();
  const { showConfirm } = useConfirmContext();
  const { billData, updateSharedPositions } = useCreateBillContext();
  const { headerTitle, goNext, goBack, exitWizard, isLastStep } =
    useBillWizard();
  const { currencies } = useCurrencies();

  const sharedIndexes = useMemo(() => {
    return billData.positions
      .map((pos, index) => (pos.isSharedByAll ? index : -1))
      .filter((index) => index !== -1);
  }, [billData.positions]);

  const currencySymbol = useMemo(() => {
    const selectedCurrency = currencies.find(
      (currency) => currency.code === billData.currency,
    );
    return selectedCurrency ? selectedCurrency.symbol : "";
  }, [currencies, billData.currency]);

  const selectAll = () => {
    updateSharedPositions(billData.positions.map((_, index) => index));
  };

  const deselectAll = () => {
    updateSharedPositions([]);
  };

  const toggleItem = (index: number) => {
    const nextIndexes = sharedIndexes.includes(index)
      ? sharedIndexes.filter((i) => i !== index)
      : [...sharedIndexes, index];

    updateSharedPositions(nextIndexes);
  };

  const handleNext = () => {
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

  const isSelectAllDisabled =
    sharedIndexes.length === billData.positions.length;
  const isDeselectAllDisabled = sharedIndexes.length === 0;
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
      <View style={styles.topSection}>
        <Typography
          text={translations["sharedItemsTitle"]}
          variant="header-small"
        />

        <View style={styles.actionRow}>
          <Button
            onPress={selectAll}
            text={translations["selectAll"]}
            disabled={isSelectAllDisabled}
            fullWidth
          />

          <Button
            onPress={deselectAll}
            text={translations["deselectAll"]}
            disabled={isDeselectAllDisabled}
            variant="secondary"
            fullWidth
          />
        </View>
      </View>

      <Scroll
        gapSize="small"
        keyboardPersist="never"
      >
        {billData.positions.map((position, i) => {
          const isSelected = sharedIndexes.includes(i);
          const lineTotal = (position.unitPrice * position.quantity).toFixed(2);

          return (
            <ListItem
              key={`SharedPositions/${i}`}
              onPress={() => toggleItem(i)}
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

                <Checkbox isChecked={isSelected} />
              </View>
            </ListItem>
          );
        })}
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
          onPress={handleNext}
          fullWidth
        />
      </View>
    </LayoutProvider>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    topSection: {
      gap: theme.spacing(3),
    },
    actionRow: {
      flexDirection: "row",
      gap: theme.spacing(3),
    },
    itemLeft: {
      flex: 1,
      gap: theme.spacing(0.5),
    },
    itemRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing(3),
    },
    bottomActions: {
      flexDirection: "row",
      gap: theme.spacing(3),
    },
  });
};

export default SharedPositions;
