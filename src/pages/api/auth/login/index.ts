import db from "../../../../configs/db";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";
import bcrypt from "bcrypt";

export default async function handler(req: any, res: any) {
  const jwtSecret: any =
    "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNDg3NDE4OSwiaWF0IjoxNzE0ODc0MTg5fQ.msJVq7Jck6-0qgUfbFJ1gqVxF2Zshv-0orYx2Qe2eyc";

  const { email, password } = req.body;

  if (req.method === "POST") {
    try {
      db.query('SELECT * FROM user WHERE email=?',[email], async (err: any, result: any) => {
        if (err) {
          console.error('Kullanıcı getiriliken bir hata oluştu:', err);
          return res.status(500).json({message: 'Internal Server Error'});
        }

        if (!result || result.length === 0) {
          return res.status(404).json({ message: "User not found!" });
        }

        const isMatchPassword = await bcrypt.compare(password, result[0].password);

        if (!isMatchPassword) {
          return res.status(422).json({ message: "Wrong password!" });
        }

        const token = jwt.sign({ userId: result[0].id }, jwtSecret, {
          expiresIn: "60h",
        });

        setCookie("token", token, {
          req,
          res,
          maxAge: 60 * 60 * 24, // 1 day
          path: "/",
        });

        return res.status(200).json(result[0]);
      });


    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  } else {
    res.status(424).json({ message: "Invalid method!" });
  }
}
