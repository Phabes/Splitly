import { FC } from "react";
import { TouchableOpacity } from "react-native";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { InputIcon } from "../InputIcon";

type TogglePasswordProps = {
  status: boolean;
  toggleStatus: (status: boolean) => any;
};

export const TogglePassword: FC<TogglePasswordProps> = ({
  status,
  toggleStatus,
}) => {
  const passwordIcon = status ? faEye : faEyeSlash;

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
