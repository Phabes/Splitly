import { FC } from "react";
import { TouchableIcon } from "@/app/components/TouchableIcon";

type TogglePasswordProps = {
  status: boolean;
  toggleStatus: (status: boolean) => any;
};

export const TogglePassword: FC<TogglePasswordProps> = ({
  status,
  toggleStatus,
}) => {
  const passwordIcon = status ? "Eye" : "EyeSlash";

  const togglePasswordIcon = () => {
    toggleStatus(!status);
  };

  return (
    <TouchableIcon
      icon={passwordIcon}
      onPress={togglePasswordIcon}
      color="text-disabled"
      size="small"
      hitBox="large"
    />
  );
};

export default TogglePassword;
