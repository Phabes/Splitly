export type ResponseCodeKeys =
  // middleware/authMiddleware
  | "authentication/noTokenProvided"
  | "authentication/tokenExpired"
  | "authentication/tokenFailed"
  // controllers/users
  | "verification/userNotFound"
  | "verification/success"
  | "verification/error"
  | "tokensRenewal/noRefreshToken"
  | "tokensRenewal/success"
  | "tokensRenewal/error"
  | "signUp/fieldsValidationError"
  | "signUp/success"
  | "signUp/error"
  | "signIn/fieldsValidationError"
  | "signIn/success"
  | "signIn/error"
  // controllers/friends
  | "getFriendSuggestions/success"
  | "getFriendSuggestions/error"
  | "postFriendRequest/friendshipAlreadyExists"
  | "postFriendRequest/friendRequestPending"
  | "postFriendRequest/requestRenewalSuccess"
  | "postFriendRequest/requestSuccess"
  | "postFriendRequest/requestError"
  | "getFriendRequests/success"
  | "getFriendRequests/error"
  | "patchFriendRequest/notFound"
  | "patchFriendRequest/noAuthorizedRecipient"
  | "patchFriendRequest/alreadyResponded"
  | "patchFriendRequest/success"
  | "patchFriendRequest/error";

export default function Index() {
  return null;
}
