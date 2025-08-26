import { sendMail } from "./utils/contactFormMailer";

export const postEmail = async (req, res) => {
  if (
    !req.body ||
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.message ||
    !req.body.type
  ) {
    console.error("Invalid request body:", req.body);
    return res.status(400).send("Invalid request body");
  }
  const sendEmailResponse = sendMail(req.body);
  if (sendEmailResponse instanceof Error) {
    return res.status(500).send("Error sending email");
  }
  // Assuming sendMail returns a success message or similar
  return res.status(200).send("Email sent successfully");
};
