import { sendAdminEmail } from "../mail/utils/adminNotifyMailer";

export const postLog = async (req, res) => {
  if (!req.body || !req.body.severity || !req.body.info) {
    console.error("Invalid request body:", req.body);
    return res.status(400).send("Invalid request body");
  }
  const sendEmailResponse = sendAdminEmail(req.body);
  if (sendEmailResponse instanceof Error) {
    return res.status(500).send("Error sending email");
  }
  // Assuming sendMail returns a success message or similar
  return res.status(200).send("Email sent successfully");
};
