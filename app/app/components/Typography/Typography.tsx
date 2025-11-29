import { ColorKeys, TypographyKeys } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks";
import { FC } from "react";
import { Text } from "react-native";

type TypographyProps = {
  text: string;
  variant?: TypographyKeys;
  color?: ColorKeys;
};

export const Typography: FC<TypographyProps> = ({
  text,
  variant = "body-medium",
  color = "text-primary",
}) => {
  const theme = useTheme();

  return (
    <Text style={[theme.typography[variant], { color: theme.colors[color] }]}>
      {text}
    </Text>
  );
};

export default Typography;
