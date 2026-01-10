import { Button, Input, LoadingWrapper, NavBar } from "@/app/components";
import { useAuthContext, useTranslations } from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FC, useState } from "react";

export const Friends: FC = () => {
  const { signOut } = useAuthContext();
  const translations = useTranslations();

  const [value, setValue] = useState("");

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text="Friends"
          button={
            <Button
              text="Sign Out"
              onPress={signOut}
            />
          }
        />
      }
    >
      <LoadingWrapper isLoading={false}>
        <Input
          text={value}
          onChange={setValue}
          placeholder={translations["searchFriends"]}
          beginIcon={faSearch}
        />
      </LoadingWrapper>
    </LayoutProvider>
  );
};

export default Friends;
