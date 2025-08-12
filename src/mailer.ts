import { SendEmailCommand } from "@aws-sdk/client-ses";
import { SESClient } from "@aws-sdk/client-ses";
import { MessageRequestType } from "./types";
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

const createSendEmailCommand = (body: MessageRequestType) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [], // optional
      ToAddresses: ["davidascholer@gmail.com"], // required
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data:
            "<div><p>From: " +
            body.firstName +
            " " +
            body.lastName +
            "</p><p>Type: " +
            body.type +
            "</p><p>Email: " +
            body.email +
            "</p><p>Phone Number: " +
            (body.phone || "") +
            "</p><p>Message: " +
            body.message +
            "</p></div>",
        },
        Text: {
          Charset: "UTF-8",
          Data:
            "From: " +
            body.firstName +
            " " +
            body.lastName +
            "\nType: " +
            body.type +
            "\nEmail: " +
            body.email +
            "\nPhone Number: " +
            (body.phone || "") +
            "\nMessage: " +
            body.message,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data:
          "Email from PIPA Broker - " +
          body.type.charAt(0).toUpperCase() +
          body.type.slice(1),
      },
    },
    Source: "noreply@pipabroker.com",
    ReplyToAddresses: [body.email],
  });
};

export const sendMail = async (body: MessageRequestType) => {
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
