import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  useBillWizard,
  useConfirmContext,
  useCreateBillContext,
  useCurrencies,
  useFormData,
  useThemeContext,
  useTranslations,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import {
  Button,
  FormData,
  Input,
  ListItem,
  NavBar,
  Scroll,
  TouchableIcon,
  Typography,
} from "@/app/components";
import { formatDecimalInput } from "@/app/utils";

export const Positions = () => {
  const translations = useTranslations();
  const { showConfirm } = useConfirmContext();

  const { billData, addPositions, removePosition, updatePosition } =
    useCreateBillContext();
  const { headerTitle, goNext, goBack, exitWizard, isLastStep } =
    useBillWizard();

  const { currencies } = useCurrencies();

  const positionNameField = useFormData("");
  const positionAmountField = useFormData("");
  const positionQtyField = useFormData("1");

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const styles = useStyles();

  const currencySymbol = useMemo(() => {
    const selectedCurrency = currencies.find(
      (currency) => currency.code === billData.currency,
    );
    return selectedCurrency ? selectedCurrency.symbol : "";
  }, [currencies, billData.currency]);

  const allocatedAmount = useMemo(() => {
    return billData.positions.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
  }, [billData.positions]);

  const totalBillAmount = billData.totalAmount;
  const currentQty = parseInt(positionQtyField.value, 10) || 0;

  const handleDecrementQty = () => {
    if (currentQty > 1) {
      positionQtyField.setValue(String(currentQty - 1));
    }
  };

  const handleIncrementQty = () => {
    positionQtyField.setValue(String(currentQty + 1));
  };

  const handleSavePosition = () => {
    const parsedAmount = parseFloat(positionAmountField.value);
    const parsedQty = currentQty > 0 ? currentQty : 1;

    if (
      !positionNameField.value.trim() ||
      isNaN(parsedAmount) ||
      parsedAmount <= 0
    ) {
      return;
    }

    if (editingIndex !== null) {
      // Edit existing position
      updatePosition(editingIndex, {
        name: positionNameField.value.trim(),
        unitPrice: parsedAmount,
        quantity: parsedQty,
        isSharedByAll: billData.positions[editingIndex].isSharedByAll,
      });
      setEditingIndex(null);
    } else {
      // Add new position
      addPositions([
        {
          name: positionNameField.value.trim(),
          unitPrice: parsedAmount,
          quantity: parsedQty,
          isSharedByAll: false,
        },
      ]);
    }

    // Reset form
    positionNameField.setValue("");
    positionAmountField.setValue("");
    positionQtyField.setValue("1");
  };

  const handleEditPosition = (index: number) => {
    const pos = billData.positions[index];
    positionNameField.setValue(pos.name);
    positionAmountField.setValue(String(pos.unitPrice));
    positionQtyField.setValue(String(pos.quantity));
    setEditingIndex(index);
  };

  const handleDuplicatePosition = (index: number) => {
    const pos = billData.positions[index];
    positionNameField.setValue(pos.name);
    positionAmountField.setValue(String(pos.unitPrice));
    positionQtyField.setValue(String(pos.quantity));
    setEditingIndex(null); // Ensure we are adding a brand new item when saved
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    positionNameField.setValue("");
    positionAmountField.setValue("");
    positionQtyField.setValue("1");
  };

  const handleScanBill = async () => {
    // Future AI scan will pass BillPosition[] directly to addPositions(...)
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

  const isAddPositionDisabled =
    positionNameField.value.trim() === "" ||
    positionAmountField.value === "" ||
    parseFloat(positionAmountField.value) <= 0 ||
    currentQty <= 0;

  const isNextDisabled =
    billData.positions.length === 0 ||
    allocatedAmount.toFixed(2) !== totalBillAmount.toFixed(2);

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
        <Button
          text={translations["scanBillWithAI"]}
          onPress={handleScanBill}
        />

        <View style={styles.trackerRow}>
          <Typography
            text={`${translations["allocated"]}: `}
            variant="body-small"
            color="text-secondary"
          />
          <Typography
            text={`${allocatedAmount.toFixed(2)} ${currencySymbol} / ${totalBillAmount.toFixed(2)} ${currencySymbol}`}
            variant="body-small"
            color={
              allocatedAmount === totalBillAmount
                ? "text-success"
                : "text-primary"
            }
          />
        </View>
      </View>

      <View style={styles.quickAddCard}>
        <FormData labelText={translations["positionName"]}>
          <Input
            text={positionNameField.value}
            onChange={positionNameField.setValue}
            placeholder={translations["positionNamePlaceholder"]}
          />
        </FormData>

        <View style={styles.amountAndQtyRow}>
          <View style={styles.amountWrapper}>
            <FormData labelText={translations["unitPrice"]}>
              <View style={styles.currencyContainer}>
                <View style={styles.currencyNumber}>
                  <Input
                    text={positionAmountField.value}
                    onChange={(value) => {
                      const formatted = formatDecimalInput(
                        value,
                        positionAmountField.value,
                        2,
                      );

                      positionAmountField.setValue(formatted);
                    }}
                    placeholder={translations["floatPlaceholder"]}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.currencySymbol}>
                  <Typography
                    text={currencySymbol}
                    variant="header-small"
                  />
                </View>
              </View>
            </FormData>
          </View>

          <View style={styles.qtyWrapper}>
            <FormData labelText={translations["quantity"]}>
              <View style={styles.stepperContainer}>
                <View style={styles.stepperBtn}>
                  <TouchableIcon
                    icon="Minus"
                    onPress={handleDecrementQty}
                    hitBox="large"
                    color={
                      currentQty > 1 ? "text-notification" : "text-disabled"
                    }
                  />
                </View>

                <View style={styles.qtyInput}>
                  <Input
                    text={positionQtyField.value}
                    onChange={(value) => {
                      const formatted = formatDecimalInput(
                        value,
                        positionQtyField.value,
                        0,
                      );

                      positionQtyField.setValue(formatted);
                    }}
                    placeholder={translations["intPlaceholder"]}
                    keyboardType="numeric"
                    centerText
                  />
                </View>

                <View style={styles.stepperBtn}>
                  <TouchableIcon
                    icon="Plus"
                    onPress={handleIncrementQty}
                    hitBox="large"
                    color="text-notification"
                  />
                </View>
              </View>
            </FormData>
          </View>
        </View>

        {editingIndex !== null ? (
          <View style={styles.editActionsRow}>
            <Button
              text={translations["cancel"]}
              onPress={handleCancelEdit}
              variant="destructive"
              fullWidth
            />
            <Button
              text={translations["save"]}
              onPress={handleSavePosition}
              disabled={isAddPositionDisabled}
              variant="secondary"
              fullWidth
            />
          </View>
        ) : (
          <Button
            text={translations["addPosition"]}
            onPress={handleSavePosition}
            disabled={isAddPositionDisabled}
            variant="secondary"
          />
        )}
      </View>

      <Typography
        text={`${translations["addedPositions"]} (${billData.positions.length})`}
        variant="body-small"
        color="text-secondary"
      />

      <Scroll gapSize="small">
        {billData.positions.map((position, i) => {
          const lineTotal = (position.unitPrice * position.quantity).toFixed(2);
          const isEditing = i === editingIndex;

          return (
            <ListItem
              key={`Positions/${i}`}
              onPress={() => handleEditPosition(i)}
            >
              <View style={styles.itemLeft}>
                <Typography
                  text={position.name}
                  color={isEditing ? "text-primary" : undefined}
                />

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

                <TouchableIcon
                  icon="Copy"
                  size="medium"
                  onPress={() => handleDuplicatePosition(i)}
                />

                <TouchableIcon
                  icon="Trash"
                  size="medium"
                  color="text-error"
                  onPress={() => removePosition(i)}
                />
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
          onPress={isLastStep ? exitWizard : goNext}
          disabled={isNextDisabled}
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
      gap: theme.spacing(2),
    },
    trackerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    quickAddCard: {
      gap: theme.spacing(3),
      paddingVertical: theme.spacing(2),
    },
    editActionsRow: {
      flexDirection: "row",
      gap: theme.spacing(2),
    },
    amountAndQtyRow: {
      flexDirection: "row",
      gap: theme.spacing(3),
      alignItems: "flex-end",
    },
    amountWrapper: {
      flex: 5,
    },
    qtyWrapper: {
      flex: 5,
    },
    currencyContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    currencyNumber: {
      flex: 4,
    },
    currencySymbol: {
      flex: 1,
      alignItems: "center",
    },
    stepperContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing(1),
    },
    stepperBtn: {
      flex: 1,
      alignItems: "center",
    },
    qtyInput: {
      flex: 2,
    },
    itemLeft: {
      flex: 1,
      gap: theme.spacing(0.5),
    },
    itemRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing(2),
    },
    bottomActions: {
      flexDirection: "row",
      gap: theme.spacing(3),
    },
  });
};

export default Positions;
