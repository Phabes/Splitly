export type ResponseMessage = {
  code: string;
  message: string;
};

export type SignInResponse = ResponseMessage & {
  userToken: string;
  refreshToken: string;
};

export default function Index() {
  return null;
}
