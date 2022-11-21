const { logger } = require("firebase-functions");
const { admin } = require("../configs/firebase.config");

/**
 * Firebase ID Token 유효성 검증하는 middleware
 *
 * 이 이후에 위치한 엔드포인트에 접근하려면 Bearer token이 HTTP header에 들어가 있어야 합니다.
 * * 예) `Authorization: Bearer <Firebase ID Token>`
 *
 * 성공적으로 decode되면 ID Token은 `req.user`에 들어가게 됩니다.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const validateFirebaseIdToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodeValue = await admin
      .auth()
      .verifyIdToken(token);
    if (decodeValue) {
      logger.log("사용자 인증됨");
      return next();
    }
    return res
      .status(403)
      .json({ message: "Unauthorized" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Error", error });
  }
};

exports.validateFirebaseIdToken = validateFirebaseIdToken;
