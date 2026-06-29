import jwt from "jsonwebtoken";

const generateToken = (user) => {

  return jwt.sign(
    {
      userId: user._id,
      employeeId: user.employeeId,
      companyId: user.companyId,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};

export default generateToken;