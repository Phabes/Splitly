export type ResponseCodeKeys =
  // middleware/authMiddleware
  | "authentication/noTokenProvided"
  | "authentication/tokenExpired"
  | "authentication/tokenFailed"
  // controllers/user
  | "verifyUser/userNotFound"
  | "verifyUser/verifySuccess"
  | "verifyUser/verifyError"
  | "refreshToken/noRefreshToken"
  | "refreshToken/refreshTokenSuccess"
  | "refreshToken/refreshTokenError"
  | "signUp/fieldsValidationError"
  | "signUp/signUpSuccess"
  | "signUp/signUpError"
  | "signIn/fieldsValidationError"
  | "signIn/signInSuccess"
  | "signIn/signInError"
  // controllers/friend
  | "searchUsers/addFriendListSearchSuccess"
  | "searchUsers/addFriendListSearchError"
  | "sendFriendRequest/friendshipAlreadyExists"
  | "sendFriendRequest/friendRequestPending"
  | "sendFriendRequest/requestRenewalSuccess"
  | "sendFriendRequest/requestSuccess"
  | "sendFriendRequest/requestError"
  | "searchFriendRequests/searchSuccess"
  | "searchFriendRequests/searchError";

export default function Index() {
  return null;
}
