import {
  faBars,
  faUserFriends,
  faLayerGroup,
  IconDefinition,
  faUser,
  faSearch,
  faPlus,
  faMinus,
  faCheck,
  faXmark,
  faCog,
  faUsers,
  faEye,
  faEyeSlash,
  faAngleLeft,
  faRotateRight,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

type IconKeys =
  | "Bars"
  | "Friends"
  | "Groups"
  | "User"
  | "Users"
  | "Search"
  | "Plus"
  | "Minus"
  | "Check"
  | "X"
  | "Cog"
  | "Eye"
  | "EyeSlash"
  | "AngleLeft"
  | "RotateRight"
  | "ChevronDown"
  | "ChevronUp";

const Icons: Record<IconKeys, IconDefinition> = {
  Bars: faBars,
  Friends: faUserFriends,
  Groups: faLayerGroup,
  User: faUser,
  Users: faUsers,
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
};

export const getIcon = (name: IconKeys): IconDefinition => {
  return Icons[name];
};

export default function Index() {
  return null;
}
