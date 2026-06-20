import { IconKeys } from "../constants/iconKeys";
import {
  faBars,
  faUserFriends,
  faLayerGroup,
  IconDefinition,
  faUser,
  faUsers,
  faUserCircle,
  faSearch,
  faPlus,
  faMinus,
  faCheck,
  faXmark,
  faCog,
  faEye,
  faEyeSlash,
  faAngleLeft,
  faRotateRight,
  faChevronDown,
  faChevronUp,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

import { faBell as faEmptyBell } from "@fortawesome/free-regular-svg-icons";

const Icons: Record<IconKeys, IconDefinition> = {
  Bars: faBars,
  Friends: faUserFriends,
  Groups: faLayerGroup,
  User: faUser,
  Users: faUsers,
  UserCircle: faUserCircle,
  Search: faSearch,
  Plus: faPlus,
  Minus: faMinus,
  Check: faCheck,
  X: faXmark,
  Cog: faCog,
  Eye: faEye,
  EyeSlash: faEyeSlash,
  AngleLeft: faAngleLeft,
  RotateRight: faRotateRight,
  ChevronDown: faChevronDown,
  ChevronUp: faChevronUp,
  Bell: faBell,
  EmptyBell: faEmptyBell,
};

export const getIcon = (name: IconKeys): IconDefinition => {
  return Icons[name];
};

export default function Index() {
  return null;
}
