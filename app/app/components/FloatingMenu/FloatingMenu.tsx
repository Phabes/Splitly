import { useFloatingMenuContext } from "@/app/hooks";
import { MenuOption } from "@/app/types";
import { FC, useRef } from "react";
import { View } from "react-native";
import { TouchableIcon } from "../TouchableIcon";

interface FloatingMenuProps {
  options: MenuOption[];
}

export const FloatingMenu: FC<FloatingMenuProps> = ({ options }) => {
  const triggerRef = useRef<React.ComponentRef<typeof View>>(null);
  const { showMenu } = useFloatingMenuContext();

  const handleOpen = () => {
    triggerRef.current?.measure(
      (
        x: number,
        y: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number,
      ) => {
        showMenu({
          options,
          trigger: { pageX, pageY, width, height },
        });
      },
    );
  };

  return (
    <View ref={triggerRef}>
      <TouchableIcon
        icon="EllipsisVertical"
        color="text-secondary"
        onPress={handleOpen}
      />
    </View>
  );
};

export default FloatingMenu;
