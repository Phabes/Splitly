import {
  Button,
  Input,
  FormLabel,
  LayoutProvider,
  LoadingWrapper,
  FormData,
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
        <FormData
          labelText={translations["email"]}
          messageText="asdsdfssd dasdavsd "
          isErrorMessage={true}
        >
          <Input
            text={email}
            placeholder={translations["email"] + "..."}
            keyboardType="email-address"
            onChange={setEmail}
          />
        </FormData>
        <FormData labelText={translations["username"]}>
          <Input
            text={username}
            placeholder={translations["username"] + "..."}
            onChange={setUsername}
          />
        </FormData>
        <FormData labelText={translations["password"]}>
          <Input
            text={password}
            placeholder={translations["password"] + "..."}
            onChange={setPassword}
          />
        </FormData>
        <FormData labelText={translations["repeatPassword"]}>
          <Input
            text={repeatedPassword}
            placeholder={translations["repeatPassword"] + "..."}
            onChange={setRepeatedPassword}
          />
        </FormData>
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
