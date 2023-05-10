import jwt from "jsonwebtoken";

// Function to generate a token based on user ID
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
export default generateToken;
