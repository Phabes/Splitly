import { Icon } from "../Icon";
import { IconProps } from "../Icon/Icon";

export interface CheckboxProps {
  isChecked: boolean;
  size?: IconProps["size"];
}

export const Checkbox = ({ isChecked, size = "large" }: CheckboxProps) => {
  return (
    <Icon
      icon={isChecked ? "CheckboxChecked" : "CheckboxUnchecked"}
      color={isChecked ? "text-success" : "text-secondary"}
      size={size}
    />
  );
};

export default Checkbox;
