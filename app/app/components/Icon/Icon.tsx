import { FC } from "react";
import { ColorKeys } from "../../constants/theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useThemeContext } from "@/app/hooks";
import { IconKeys } from "@/app/constants/iconKeys";
import { getIcon } from "@/app/utils";

export type IconProps = {
  icon: IconKeys;
  color?: ColorKeys;
  size?: "large" | "medium" | "small";
};

export const Icon: FC<IconProps> = ({
  icon,
  color = "text-success",
  size = "medium",
}) => {
  const iconSize = size === "small" ? 5 : size === "medium" ? 6 : 7;
  const theme = useThemeContext();

  return (
    <FontAwesomeIcon
      icon={getIcon(icon)}
      color={theme.colors[color]}
      size={theme.spacing(iconSize)}
    />
  );
};

export default Icon;
