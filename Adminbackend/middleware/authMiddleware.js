import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {

  try {

    const authHeader =
      req.headers.authorization;

    const token =
      authHeader?.split(" ")[1];

    if (!token) {

      return res.status(401).json({
        message: "Unauthorized"
      });

    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(
      "JWT USER:",
      decoded
    );

    req.user = decoded;

    next();

  } catch (err) {

    console.log(
      "AUTH ERROR:",
      err.message
    );

    return res.status(401).json({
      message: "Invalid Token"
    });

  }

};

export default authMiddleware;