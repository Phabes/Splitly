import { Button, LoadingWrapper, NavBar } from "@/app/components";
import { useAuthContext } from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { FC } from "react";

export const Friends: FC = () => {
  const { signOut } = useAuthContext();

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
      <LoadingWrapper isLoading={true}></LoadingWrapper>
    </LayoutProvider>
  );
};

export default Friends;
