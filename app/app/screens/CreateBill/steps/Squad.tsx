import { StyleSheet, View } from "react-native";
import { useBillWizard } from "../../../hooks/useBillWizard";
import {
  useConfirmContext,
  useCreateBillContext,
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
import { useEffect, useRef } from "react";

export const Squad = () => {
  const translations = useTranslations();
  const { showConfirm } = useConfirmContext();

  const { billData, billForm, members, setInvolvedMembers } =
    useCreateBillContext();
  const { headerTitle, goNext, goBack, exitWizard, isLastStep } =
    useBillWizard();

  const selectedIDs = billData.involvedMembers || [];

  const hasAutoSelected = useRef(false);

  useEffect(() => {
    if (!hasAutoSelected.current && members.length > 0) {
      if (selectedIDs.length === 0) {
        setInvolvedMembers(members.map((m) => m._id));
      }

      hasAutoSelected.current = true;
    }
  }, [members, selectedIDs.length, setInvolvedMembers]);

  const selectAll = () => {
    setInvolvedMembers(members.map((m) => m._id));
  };

  const deselectAll = () => {
    setInvolvedMembers([]);
  };

  const toggleMember = (id: string) => {
    const nextIDs = selectedIDs.includes(id)
      ? selectedIDs.filter((prevId) => prevId !== id)
      : [...selectedIDs, id];

    setInvolvedMembers(nextIDs);
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

  const isNextDisabled = selectedIDs.length === 0;
  const isSelectAllDisabled = selectedIDs.length === members.length;

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
          text={translations["whoWasInvolved"]}
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
            disabled={isNextDisabled}
            variant="secondary"
            fullWidth
          />
        </View>
      </View>

      <Scroll
        gapSize="small"
        keyboardPersist="never"
      >
        {members.map((member, i) => {
          const isSelected = selectedIDs.includes(member._id);
          const isPayer = member._id === billForm.payerIDField.value;

          return (
            <ListItem
              key={`Squad/${i}`}
              onPress={() => toggleMember(member._id)}
            >
              <View style={styles.nameContainer}>
                <Typography text={member.username} />
                {isPayer && (
                  <Typography
                    text={` (${translations["payer"]})`}
                    color="text-secondary"
                  />
                )}
              </View>

              <Checkbox isChecked={isSelected} />
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
          onPress={isLastStep ? exitWizard : handleNext}
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
      gap: theme.spacing(3),
    },
    actionRow: {
      flexDirection: "row",
      gap: theme.spacing(3),
    },
    nameContainer: {
      flex: 1,
      flexDirection: "row",
    },
    bottomActions: {
      flexDirection: "row",
      gap: theme.spacing(3),
    },
  });
};

export default Squad;
