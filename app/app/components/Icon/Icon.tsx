import { FC } from "react";
import { ColorKeys } from "../../constants/theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useThemeContext } from "@/app/hooks";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export type IconProps = {
  icon: IconProp;
  color?: ColorKeys;
  size?: "small" | "large";
};

export const Icon: FC<IconProps> = ({
  icon,
  color = "text-success",
  size = "small",
}) => {
  const iconSize = size === "small" ? 6 : 7;
  const theme = useThemeContext();

  return (
    <FontAwesomeIcon
      icon={icon}
      color={theme.colors[color]}
      size={theme.spacing(iconSize)}
    />
  );
};

export default Icon;
