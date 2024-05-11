import db from "../../../configs/db";
import jwt from "jsonwebtoken";


export default async function handler(req: any, res: any) {
  const {method, body, query} = req;
  const jwtSecret: any =
    "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNDg3NDE4OSwiaWF0IjoxNzE0ODc0MTg5fQ.msJVq7Jck6-0qgUfbFJ1gqVxF2Zshv-0orYx2Qe2eyc";

  // Token kontrolü
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({message: 'Yetkisiz Erişim.Token Yok'});
  }


  try {

    switch (method) {
      case 'GET':
        if (query && query.id) {
          db.query('UPDATE orders SET status = ? WHERE id = ?', [1, query.id], (err: any, result: any) => {
            if (err) {
              console.error('Sipariş güncellenirken bir hata oluştu:', err);
              return res.status(500).json({message: 'Internal Server Error'});
            }

            return res.status(200).json({message: 'Sipariş durumu başarıyla güncellendi'});
          })
        }
        break;
      case 'PUT':
        const {role, status, product_id, quantity} = req.body;
        if (role !== 0) {
          return res.status(401).json({message: 'Yetkisiz Erişim'});
        }
        const decodedToken: any = jwt.verify(token, jwtSecret);
        const user_id = decodedToken.userId;

        db.query('UPDATE order_detail SET status = ? WHERE order_id = ? AND product_id = ?', [status, query.id, product_id], async (err: any, result: any) => {
          if (err) {
            console.error('Sipariş güncellenirken bir hata oluştu:', err);
            return res.status(500).json({message: 'Internal Server Error'});
          }

          if (status === 1) {
            await db.query('UPDATE product SET stock = stock - ? WHERE id = ?', [quantity, product_id], (err: any, result: any) => {
              if (err) {
                console.error('Stok güncellenirken bir hata oluştu:', err);
              }
            })
          } else if (status === 3) {
            await db.query('UPDATE product SET stock = stock + ? WHERE id = ?', [quantity, product_id], (err: any, result: any) => {
              if (err) {
                console.error('Stok güncellenirken bir hata oluştu:', err);
              }
            })
          }


          return res.status(200).json({message: 'Sipariş durumu başarıyla güncellendi'});
        })
        break;
      case 'DELETE':

        // Ürün sil
        const productId = query.id;

        if (!productId) {
          return res.status(400).json({message: 'Lütfen tüm alanları doldurun!'});
        }

        // Veritabanında ilgili ürünü silme işlemi
        db.query('DELETE FROM product WHERE id = ?', [productId], (err: any, result: any) => {
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
