import {
  Button,
  Input,
  Label,
  LayoutProvider,
  LoadingWrapper,
} from "@/app/components";
import { useTranslations } from "@/app/hooks";
import { useAuthNavigation } from "@/app/hooks/useAuthNavigation";
import { FC, useState } from "react";

export const SignUp: FC = () => {
  const navigation = useAuthNavigation();
  const translations = useTranslations("en");

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");

  return (
    <LoadingWrapper isLoading={isLoading}>
      <LayoutProvider>
        <Label text={translations["email"]} />
        <Input
          text={email}
          placeholder={translations["email"] + "..."}
          keyboardType="email-address"
          onChange={setEmail}
        />
        <Label text={translations["username"]} />
        <Input
          text={username}
          placeholder={translations["username"] + "..."}
          onChange={setUsername}
        />
        <Label text={translations["password"]} />
        <Input
          text={password}
          placeholder={translations["password"] + "..."}
          onChange={setPassword}
        />
        <Label text={translations["repeatPassword"]} />
        <Input
          text={repeatedPassword}
          placeholder={translations["repeatPassword"] + "..."}
          onChange={setRepeatedPassword}
        />
        <Button
          text={translations["signUp"]}
          onPress={() => {}}
        />
        <Button
          text={translations["signIn"]}
          variant="secondary"
          onPress={() => navigation.replace("SignIn")}
        />
      </LayoutProvider>
    </LoadingWrapper>
  );
};

export default SignUp;
