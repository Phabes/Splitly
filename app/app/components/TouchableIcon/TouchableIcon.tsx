import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FC } from "react";
import { TouchableOpacity } from "react-native";
import { Icon } from "../Icon";
import { useThemeContext } from "@/app/hooks";
import { ColorKeys } from "@/app/constants/theme";

type TouchableIconProps = {
  icon: IconProp;
  onPress: () => void;
  color?: ColorKeys;
};

export const TouchableIcon: FC<TouchableIconProps> = ({
  icon,
  onPress,
  color = "text-success",
}) => {
  const theme = useThemeContext();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      hitSlop={theme.spacing(4)}
    >
      <Icon
        icon={icon}
        color={color}
        size="large"
      />
    </TouchableOpacity>
  );
};

export default TouchableIcon;
