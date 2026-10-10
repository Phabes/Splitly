import { StyleSheet, View } from "react-native";
import { useBillWizard } from "../../../hooks/useBillWizard";
import {
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
import { useEffect, useState } from "react";

export const Squad = () => {
  const translations = useTranslations();

  const { billData, billForm, members, setInvolvedMembers } =
    useCreateBillContext();
  const { headerTitle, goNext, goBack, exitWizard, isLastStep } =
    useBillWizard();

  const [selectedIDs, setSelectedIDs] = useState<string[]>([]);

  useEffect(() => {
    if (billData.involvedMembers && billData.involvedMembers.length > 0) {
      const previouslySelected = billData.involvedMembers;
      setSelectedIDs(previouslySelected);
    } else if (members.length > 0) {
      setSelectedIDs(members.map((m) => m._id));
    }
  }, [billData.involvedMembers, members]);

  const selectAll = () => setSelectedIDs(members.map((m) => m._id));
  const deselectAll = () => setSelectedIDs([]);

  const toggleMember = (id: string) => {
    setSelectedIDs((prev) =>
      prev.includes(id)
        ? prev.filter((prevId) => prevId !== id)
        : [...prev, id],
    );
  };

  const handleNext = () => {
    setInvolvedMembers(selectedIDs);

    goNext();
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
      <Typography
        text={translations["whoWasInvolved"]}
        variant="header-small"
      />

      <View style={styles.actionRow}>
        <View style={styles.actionbutton}>
          <Button
            onPress={selectAll}
            text={translations["selectAll"]}
            disabled={isSelectAllDisabled}
          />
        </View>
        <View style={styles.actionbutton}>
          <Button
            onPress={deselectAll}
            text={translations["deselectAll"]}
            disabled={!isSelectAllDisabled}
            variant="secondary"
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

      <Button
        text={
          isLastStep ? translations["createBill"] : translations["nextStep"]
        }
        onPress={isLastStep ? exitWizard : handleNext}
        disabled={isNextDisabled}
      />
    </LayoutProvider>
  );
};

const useStyles = () => {
  const theme = useThemeContext();

  return StyleSheet.create({
    actionRow: {
      flexDirection: "row",
      gap: theme.spacing(3),
    },
    actionbutton: {
      flex: 1,
    },
    nameContainer: {
      flex: 1,
      flexDirection: "row",
    },
  });
};

export default Squad;
