import db from "src/configs/db";
import jwt from 'jsonwebtoken';
import {setCookie, getCookie, getCookies} from "cookies-next";
const jwtSecret: any =
  "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNDg3NDE4OSwiaWF0IjoxNzE0ODc0MTg5fQ.msJVq7Jck6-0qgUfbFJ1gqVxF2Zshv-0orYx2Qe2eyc";

// Sipariş verme
export default async function handler(req: any, res: any) {
  // Token kontrolü



  if (req.method === 'GET') {

    const token = req.headers.authorization

    const decodedToken: any = jwt.verify(token, jwtSecret);
    const user_id = decodedToken.userId;

    if (token) {
      try {

        // Kullanıcı kimliğini kullanarak sepeti getir
        db.query(
          'SELECT cart.*, product.name AS productName, product.price AS productPrice, product.stock AS stock, product.file_path as file FROM cart JOIN product ON cart.product_id = product.id WHERE cart.user_id = ?',
          [user_id],
          (err: any, result: any) => {
            if (err) {
              console.error('Sepet getirilirken bir hata oluştu:', err);
              return res.status(500).json({ message: 'Internal Server Error' });
            }

            return res.status(200).json(result);
          }
        );
      } catch (error) {
        console.error('Token çözümlenirken bir hata oluştu:', error);
        return res.status(401).json({ message: 'Unauthorized' });
      }
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
  else if (req.method === 'POST') {
    try {
      const { userId,productId } = req.body;
      const product_id = productId;
      const user_id = userId;

      // Ürünün stok durumunu kontrol et
      db.query('SELECT stock FROM product WHERE id = ?', [product_id], (err: any, productResult: any) => {
        if (err) {
          console.error('Ürün stok kontrolü sırasında bir hata oluştu:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        // Eğer ürün bulunamazsa
        if (productResult.length === 0) {
          console.error('Ürün bulunamadı');
          return res.status(404).json({ message: 'Ürün bulunamadı' });
        }

        const productStock = productResult[0].stock;

        // Kullanıcının sepetindeki toplam ürün sayısını al
        db.query('SELECT COUNT(*) AS itemCount FROM cart WHERE user_id = ?', [user_id], (err: any, cartCountResult: any) => {
          if (err) {
            console.error('Kullanıcının sepet sayısı alınırken bir hata oluştu:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
          }

          const itemCount = cartCountResult[0].itemCount;

          // Eğer sepete eklenecek ürün sayısı, mevcut stoktan fazlaysa
          if (itemCount >= productStock) {
            console.error('Ürün stokta bulunmamaktadır');
            return res.status(400).json({ message: 'Ürün stokta bulunmamaktadır' });
          }

          // Ürünü sepete ekle
          db.query('INSERT INTO `cart` SET ?', { user_id, product_id }, (err: any, result: any) => {
            if (err) {
              console.error('Sepete eklenirken bir hata oluştu:', err);
              return res.status(500).json({ message: 'Internal Server Error' });
            } else {
              // Kullanıcının sepetindeki tüm ürünleri yanıt olarak döndür
              db.query('SELECT * FROM cart WHERE user_id = ?', [user_id], (err: any, cartItems: any) => {
                if (err) {
                  console.error('Kullanıcının sepeti alınırken bir hata oluştu:', err);
                  return res.status(500).json({ message: 'Internal Server Error' });
                }
                return res.status(200).json({ message: 'Ürün başarıyla sepete eklendi', data: cartItems });
              });
            }
          });
        });
      });

    } catch (error) {
      console.error('Sepete ekleme hatası:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  else {
    res.status(405).json({message: 'Method Not Allowed'});
  }
}


