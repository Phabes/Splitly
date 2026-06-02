import { FC } from "react";
import { TouchableOpacity } from "react-native";
import { InputIcon } from "../InputIcon";
import { getIcon } from "@/app/utils";

type TogglePasswordProps = {
  status: boolean;
  toggleStatus: (status: boolean) => any;
};

export const TogglePassword: FC<TogglePasswordProps> = ({
  status,
  toggleStatus,
}) => {
  const passwordIcon = getIcon(status ? "Eye" : "EyeSlash");

  const togglePasswordIcon = () => {
    toggleStatus(!status);
  };

  return (
    <TouchableOpacity onPress={togglePasswordIcon}>
      <InputIcon icon={passwordIcon} />
    </TouchableOpacity>
  );
};

export default TogglePassword;
