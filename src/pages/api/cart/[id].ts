import db from "../../../configs/db";
import jwt from "jsonwebtoken";

const jwtSecret: any =
  "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNDg3NDE4OSwiaWF0IjoxNzE0ODc0MTg5fQ.msJVq7Jck6-0qgUfbFJ1gqVxF2Zshv-0orYx2Qe2eyc";


export default async function handler(req: any, res: any) {
  const {method, body, query} = req;


  // Token kontrolü
  const token = req.cookies.token;
  const productId = query.id;

  if (!token) {
    return res.status(401).json({message: 'Yetkisiz Erişim.Token Yok'});
  }

  // Tokeni çözümle ve kullanıcı kimliğini al
  const decodedToken: any = jwt.verify(token, jwtSecret);
  const userId = decodedToken.userId;

  try {

    switch (method) {
      case 'DELETE':

        console.log('productId:', productId);
        console.log('userId:', userId);


        // Veritabanında ilgili ürünü silme işlemi
        db.query('DELETE FROM cart WHERE user_id=? AND product_id=?', [userId, productId], (err: any, result: any) => {
          if (err) {
            console.error('Ürün silinirken bir hata oluştu:', err);
            return res.status(500).json({message: 'Internal Server Error'});
          }

          return res.status(200).json({message: 'Ürün başarıyla silindi'});
        });
        break;
      default:
        return res.status(405).json({message: 'Method Not Allowed'});
    }
  } catch (error) {
    return res.status(401).json({message: 'Unauthorized - Invalid token'});
  }
}
