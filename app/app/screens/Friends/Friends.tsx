import {
  Button,
  Input,
  LoadingWrapper,
  NavBar,
  Scroll,
} from "@/app/components";
import { useAppNavigation, useAuthContext, useTranslations } from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FC, useState } from "react";

export const Friends: FC = () => {
  const { signOut } = useAuthContext();
  const translations = useTranslations();
  const navigation = useAppNavigation();

  const [searchValue, setSearchValue] = useState("");

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text={translations["friends"]}
          button={
            <Button
              text={translations["signOut"]}
              onPress={signOut}
            />
          }
        />
      }
    >
      <LoadingWrapper isLoading={false}>
        <Input
          text={searchValue}
          onChange={setSearchValue}
          placeholder={translations["searchFriends"]}
          beginIcon={faSearch}
        />
        <Button
          text={translations["addFriend"]}
          onPress={() => navigation.navigate("AddFriend")}
        />
        <Scroll></Scroll>
      </LoadingWrapper>
    </LayoutProvider>
  );
};

export default Friends;
