import { Button, Input } from "@/app/components";
import { useTheme, useTranslations } from "@/app/hooks";
import { useAuthNavigation } from "@/app/hooks/useAuthNavigation";
import { FC, useState } from "react";
import { View } from "react-native";

export const SignUp: FC = () => {
  const navigation = useAuthNavigation();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const translations = useTranslations("en");

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors["background-app"],
        gap: 10,
      }}
    >
      <Input
        text={email}
        placeholder="Email..."
        keyboardType="email-address"
        onChange={setEmail}
      />
      <Input
        text={username}
        placeholder={"Username..."}
        onChange={setUsername}
      />
      <Input
        text={password}
        placeholder="Password..."
        onChange={setPassword}
      />
      <Input
        text={repeatedPassword}
        placeholder="Repeat Password..."
        onChange={setRepeatedPassword}
      />
      <Button
        text={"Sign Up"}
        onPress={() => {}}
      />
      <Button
        text={"Sign In"}
        variant="secondary"
        onPress={() => navigation.replace("SignIn")}
      />
    </View>
  );
};

export default SignUp;
