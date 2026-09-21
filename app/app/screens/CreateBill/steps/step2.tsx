import React, { FC, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "expo-router/react-navigation";
import { useBillWizard } from "@/app/hooks";

export const Step2: FC = () => {
  const navigation = useNavigation();
  const { headerTitle, goNext, goBack, exitWizard } = useBillWizard();

  // Dynamically update the header title!
  useEffect(() => {
    navigation.setOptions({ title: headerTitle });
  }, [headerTitle]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Users Info Screen</Text>

      <Button
        title="Next Step"
        onPress={goNext}
      />
      <Button
        title="Back Step"
        onPress={goBack}
      />
      <Button
        title="Cancel"
        color="red"
        onPress={exitWizard}
      />
    </View>
  );
};

export default Step2;
