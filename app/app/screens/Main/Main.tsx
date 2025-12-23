import { Button, LoadingWrapper, Navbar } from "@/app/components";
import { useAuthContext, useTranslations } from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { FC } from "react";

export const Main: FC = () => {
  const translations = useTranslations();
  const { signOut } = useAuthContext();

  return (
    <LoadingWrapper isLoading={false}>
      <LayoutProvider
        navbar={
          <Navbar
            text={translations["signIn"]}
            button={
              <Button
                text="Sign Out"
                onPress={signOut}
              />
            }
          />
        }
      ></LayoutProvider>
    </LoadingWrapper>
  );
};

export default Main;
