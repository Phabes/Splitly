import { Button, LoadingWrapper, NavBar } from "@/app/components";
import { useAuthContext } from "@/app/hooks";
import { LayoutProvider } from "@/app/providers";
import { FC } from "react";

export const Groups: FC = () => {
  const { signOut } = useAuthContext();

  return (
    <LayoutProvider
      navbar={
        <NavBar
          text="Groups"
          button={
            <Button
              text="Sign Out"
              onPress={signOut}
            />
          }
        />
      }
    >
      <LoadingWrapper isLoading={false}></LoadingWrapper>
    </LayoutProvider>
  );
};

export default Groups;
