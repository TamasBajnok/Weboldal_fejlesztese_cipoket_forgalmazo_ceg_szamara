import jwt from "jsonwebtoken";

const felhasznaloAzonositas = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized. Login Again" });
  }

  try {
    const tokenVisszaallit = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenVisszaallit.id) {
      req.body.felhasznaloId = tokenVisszaallit.id;
    } else {
      return res.json({
        success: false,
        message: "Not Authorized. Login Again",
      });
    }

    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default felhasznaloAzonositas;
