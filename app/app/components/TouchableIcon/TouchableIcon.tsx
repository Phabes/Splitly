import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FC } from "react";
import { TouchableOpacity, View } from "react-native";
import { Icon } from "../Icon";
import { useThemeContext } from "@/app/hooks";
import { ColorKeys } from "@/app/constants/theme";
import { IconProps } from "../Icon/Icon";
import { NotificationIndicator } from "../NotificationIndicator";

type TouchableIconProps = {
  icon: IconProp;
  onPress: () => void;
  color?: ColorKeys;
  size?: IconProps["size"];
  hitBox?: "large" | "small" | "none";
  showNotificationIndicator?: boolean;
};

export const TouchableIcon: FC<TouchableIconProps> = ({
  icon,
  onPress,
  color = "text-success",
  size = "large",
  hitBox = "small",
  showNotificationIndicator = false,
}) => {
  const theme = useThemeContext();
  const hitSlop = hitBox === "large" ? 2 : hitBox === "small" ? 1 : 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      hitSlop={theme.spacing(hitSlop)}
    >
      <Icon
        icon={icon}
        color={color}
        size={size}
      />
      {showNotificationIndicator && <NotificationIndicator />}
    </TouchableOpacity>
  );
};

export default TouchableIcon;
