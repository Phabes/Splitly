import en from "./translations/en.json";
import pl from "./translations/pl.json";

export const SUPPORTED_LANGUAGES = ["en", "pl"] as const;

export type LanguageKeys = (typeof SUPPORTED_LANGUAGES)[number];

export type TranslationKeys =
  // general
  | "loading"
  | "sentBy"
  | "fieldRequired"
  // authentication
  | "signUp"
  | "signIn"
  | "signOut"
  | "notValidEmail"
  | "tooShortPassword"
  | "weakPassword"
  | "confirmPassword"
  | "matchPasswords"
  | "emailTaken"
  | "usernameTaken"
  | "userNotFound"
  | "invalidPassword"
  // users
  | "email"
  | "username"
  | "password"
  | "repeatPassword"
  | "searchedUsers"
  | "loadingMoreUsers"
  | "noMoreUsersFound"
  | "noUsersFoundMatching"
  // currencies
  | "searchCurrency"
  // friends
  | "friends"
  | "searchFriends"
  | "addFriend"
  | "friendRequests"
  | "sendingFriendRequest"
  | "loadingMoreFriendRequests"
  | "noMoreFriendRequests"
  | "noFriendRequestsFound"
  | "acceptingFriendRequest"
  | "rejectingFriendRequest"
  | "loadingMoreFriends"
  | "noMoreFriends"
  | "noFriendsFound"
  // groups
  | "groups"
  | "searchGroups"
  | "createGroup"
  | "searchedGroups"
  | "loadingMoreGroups"
  | "noMoreGroupsFound"
  | "noGroupsFoundMatching"
  | "groupRequests"
  | "groupName"
  | "groupDescription"
  | "defaultGroupCurrency"
  | "addMembers"
  | "creatingGroup"
  | "loadingMoreGroupRequests"
  | "noMoreGroupRequests"
  | "noGroupRequestsFound"
  | "acceptingGroupRequest"
  | "rejectingGroupRequest";

export const translations: Record<
  LanguageKeys,
  Record<TranslationKeys, string>
> = {
  en: en,
  pl: pl,
};

export default function Index() {
  return null;
}
