export type MessageRequestType = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  phone?: string;
  type: "investor" | "partner";
};

export type NotificationRequestType = {
    severity: "error" | "warning" | "info";
    info: string;
};
