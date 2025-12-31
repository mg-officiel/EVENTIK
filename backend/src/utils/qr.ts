import crypto from "crypto";

export const generateQRCodeValue = () => {
  return crypto.randomBytes(16).toString("hex");
};
