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
  Icon,
  ListItem,
  NavBar,
  Scroll,
  Typography,
} from "@/app/components";
import { useEffect, useState } from "react";
import { InvolvedMember } from "@/app/types";

export const BasicInfo = () => {
  const translations = useTranslations();

  const { members, billForm, setInvolvedMembers } = useCreateBillContext();
  const { headerTitle, goNext, goBack } = useBillWizard();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const activeIds = members.map((m) => m._id);

    if (activeIds.length === 0 && members.length > 0) {
      setSelectedIds(members.map((m) => m._id));
    } else {
      setSelectedIds(activeIds);
    }
  }, [members]);

  const selectAll = () => setSelectedIds(members.map((m) => m._id));
  const deselectAll = () => setSelectedIds([]);

  const toggleMember = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((prevId) => prevId !== id)
        : [...prev, id],
    );
  };

  const handleNext = () => {
    const x: InvolvedMember[] = selectedIds.map((id) => ({
      userID: id,
      status: "picking",
    }));

    setInvolvedMembers(x);

    goNext();
  };

  const isNextDisabled = selectedIds.length === 0;
  const isSelectAllDisabled = selectedIds.length === members.length;

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
          const isSelected = selectedIds.includes(member._id);
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
                    variant="body-small"
                    color="text-secondary"
                  />
                )}
              </View>

              <Icon
                icon={isSelected ? "CheckboxChecked" : "CheckboxUnchecked"}
                size="large"
                color={isSelected ? "text-success" : "text-secondary"}
              />
            </ListItem>
          );
        })}
      </Scroll>

      <Button
        text={translations["nextStep"]}
        onPress={handleNext}
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
    listContainer: {
      display: "flex",
      flexDirection: "column",
    },
    nameContainer: {
      flex: 1,
      flexDirection: "row",
    },
    checkbox: {
      // width: 24,
      // height: 24,
      // borderRadius: 6,
      // borderWidth: 2,
      // borderColor: "#9CA3AF",
      // alignItems: "center",
      // justifyContent: "center",
    },
    checkboxSelected: {
      // backgroundColor: "#3B82F6",
      // borderColor: "#3B82F6",
    },
  });
};

export default BasicInfo;
