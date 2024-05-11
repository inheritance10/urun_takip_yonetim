import db from "src/configs/db";
import jwt from 'jsonwebtoken';
import {setCookie, getCookie, getCookies} from "cookies-next";
const jwtSecret: any =
  "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNDg3NDE4OSwiaWF0IjoxNzE0ODc0MTg5fQ.msJVq7Jck6-0qgUfbFJ1gqVxF2Zshv-0orYx2Qe2eyc";

// Sipariş verme
export default async function handler(req: any, res: any) {
  // Token kontrolü

  if (req.method === 'GET') {


    const token = req.cookies.token

    if (token) {
      try {

        // Kullanıcı kimliğini kullanarak sepeti getir
        db.query('SELECT orders.*, order_detail.*, product.* FROM orders JOIN order_detail ON orders.id = order_detail.order_id JOIN product ON order_detail.product_id = product.id', (err: any, result: any) => {
          if (err) {
            console.error('Siparişler getirilirken bir hata oluştu:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
          }

          return res.status(200).json(result);
        })
      } catch (error) {
        console.log(error)
        console.error('Token çözümlenirken bir hata oluştu:', error);
        return res.status(401).json({ message: 'Unauthorized' });
      }
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
  else if (req.method === 'POST') {
    try {
      const { userId, cartItems } = req.body;
      const user_id = userId;
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      await db.query('SELECT * FROM user WHERE id = ?', [user_id], async (err: any, result: any) => {
        if (err) {
          console.error('Kullanıcı bilgileri getirilirken bir hata oluştu:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (result.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }


        // Sipariş bilgilerini ekleme
        const order = {
          user_id,
          total_amount: getTotalAmount(cartItems), // Sepetteki toplam fiyatı hesaplayın
          order_date: new Date(), // Şuanki tarih ve saat
        };

        // orders tablosuna siparişi ekle
        const orderId = await addOrder(order);

        // Her ürün için sipariş detaylarını ekleyin
        for (const cartItem of cartItems) {
          const orderDetail = {
            order_id: orderId,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            unit_price: cartItem.productPrice,
            total_price: cartItem.quantity * cartItem.productPrice,
            status: 0
          };

          // order_details tablosuna sipariş detayını ekleyin
          await addOrderDetail(orderDetail);


        }

        // Başarılı bir şekilde sipariş verildiğine dair yanıt gönderin
        res.status(200).json({ message: 'Order placed successfully' });

        await db.query('DELETE FROM cart WHERE user_id = ?', [user_id], (err: any, result: any) => {
          if (err) {
            console.error('Sepet temizlenirken bir hata oluştu:', err);
          }
        })



      });


    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  else {
    res.status(405).json({message: 'Method Not Allowed'});
  }
}

const getTotalAmount = (cartItems: any) => {
  let totalPrice = 0;
  let totalQuantity = 0;

  cartItems.forEach((item: any) => {
    totalQuantity += item.quantity;
    totalPrice += item.quantity * item.productPrice;
  });

  return totalPrice;
};
const addOrder = (order: any) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO `orders` SET ?', order, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.insertId);
      }
    });
  });
}

const addOrderDetail = (orderDetail: any) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO `order_detail` SET ?', orderDetail, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.insertId);
      }
    });
  });
}

