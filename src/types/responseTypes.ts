export type SuccessUserResponse = {
  message: string;
  user: {
    avatar: string | null;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    username: string;
  };
};

export type FailureResponse = {
  error: string;
  status: number;
}
