import { FC } from "react";
import { StyleSheet } from "react-native";
import { useBillWizard } from "../../hooks/useBillWizard";
import {
  useAuthContext,
  useCreateBillContext,
  useFormData,
  useThemeContext,
} from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { LoadingWrapper, NavBar } from "@/app/components";
import { BasicInfoForm } from "./forms";

export const BasicInfo: FC = () => {
  const { headerTitle, goNext, goBack, exitWizard } = useBillWizard();
  const { isLoading } = useCreateBillContext();

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
        <BasicInfoForm />
      </LoadingWrapper>
    </LayoutProvider>
  );
};

export default BasicInfo;
