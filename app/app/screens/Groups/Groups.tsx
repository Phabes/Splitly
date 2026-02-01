import { Button, LoadingWrapper, NavBar } from "@/app/components";
import { useAuthContext, useTranslations } from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { FC } from "react";

export const Groups: FC = () => {
  const { signOut } = useAuthContext();
  const translations = useTranslations();

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text={translations["groups"]}
          button={
            <Button
              text={translations["signOut"]}
              onPress={signOut}
            />
          }
        />
      }
    >
      <LoadingWrapper isLoading={true}></LoadingWrapper>
    </LayoutProvider>
  );
};

export default Groups;
