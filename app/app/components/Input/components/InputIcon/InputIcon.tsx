import { useThemeContext } from "@/app/hooks";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { FC } from "react";

type InputIconProps = {
  icon: IconProp;
};

export const InputIcon: FC<InputIconProps> = ({ icon }) => {
  const theme = useThemeContext();

  return (
    <FontAwesomeIcon
      icon={icon}
      color={theme.colors["text-disabled"]}
      size={theme.spacing(5)}
    />
  );
};

export default InputIcon;
