import {
  faAngleLeft,
  faBars,
  faBell,
  faCheck,
  faChevronDown,
  faChevronUp,
  faCog,
  faCrown,
  faEllipsisVertical,
  faEye,
  faEyeSlash,
  faHourglass1,
  faLayerGroup,
  faMinus,
  faPlus,
  faRotateRight,
  faSearch,
  faUser,
  faUserCircle,
  faUserFriends,
  faUserGear,
  faUsers,
  faXmark,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { IconKeys } from "../constants/iconKeys";

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
  EllipsisVertical: faEllipsisVertical,
  Owner: faCrown,
  Admin: faUserGear,
  Pending: faHourglass1,
};

export const getIcon = (name: IconKeys): IconDefinition => {
  return Icons[name];
};

export default function Index() {
  return null;
}
