export type MessageRequestType = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  phone?: string;
  type: "investor" | "partner";
};
