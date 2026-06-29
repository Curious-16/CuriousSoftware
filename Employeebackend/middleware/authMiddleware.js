import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {

  console.log("================================");
  console.log("REQUEST:", req.method, req.originalUrl);

  try {

    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    const token = authHeader?.split(" ")[1];

    console.log("TOKEN:", token);

    if (!token) {

      console.log("NO TOKEN RECEIVED");

      return res.status(401).json({
        message: "Unauthorized"
      });

    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("JWT USER:", decoded);

    req.user = decoded;

    next();

  } catch (err) {

    console.log("AUTH ERROR:", err.message);

    return res.status(401).json({
      message: "Invalid Token"
    });

  }

};

export default authMiddleware;