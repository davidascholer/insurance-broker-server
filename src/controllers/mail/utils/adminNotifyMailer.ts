import { SendEmailCommand } from "@aws-sdk/client-ses";
import { SESClient } from "@aws-sdk/client-ses";
import { NotificationRequestType } from "../../../lib/pets";
import { ADMIN_EMAIL_LIST } from "../../../lib/constants";
// Set the AWS Region.
const REGION = "us-west-2";
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const createSendEmailCommand = (body: NotificationRequestType) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [], // optional
      ToAddresses: ADMIN_EMAIL_LIST, // required
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data:
            "<div><p>Severity: " +
            body.severity +
            "</p><p>Info: " +
            body.info +
            "</p></div>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "Severity: " + body.severity + "\n\nInfo: " + body.info,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data:
          "PIPA Log - " +
          body.severity.charAt(0).toUpperCase() +
          body.severity.slice(1),
      },
    },
    Source: "log@pipabroker.com",
  });
};

export const sendAdminEmail = async (body: NotificationRequestType) => {
  const sendEmailCommand = createSendEmailCommand(body);

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

const createSendPasswordEmail = (email: string, password: string) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [], // optional
      ToAddresses: [email], // required
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "<div><p>Token: " + password + "</p></div>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "Your token: " + password,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "PIPA Admin - Token",
      },
    },
    Source: "no-reply@pipabroker.com",
  });
};

export const sendAdminPassword = async (email: string, password: string) => {
  const sendEmailCommand = createSendPasswordEmail(email, password);

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};
