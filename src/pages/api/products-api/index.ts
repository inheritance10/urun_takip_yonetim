import db from "../../../configs/db";

export default async function handler(req: any, res: any) {
  const {method, body, query} = req;

  // Token kontrolü
  //const token = req.cookies.token;

  /*if (!token) {
      return res.status(401).json({message: 'Yetkisiz Erişim.Token Yok'});
  }*/


  try {

    switch (method) {
      case 'GET':

        // Tüm ürünleri getir
        db.query('SELECT * FROM product', (err: any, result: any) => {
          if (err) {
            console.error('Ürünler getirilirken bir hata oluştu:', err);
            return res.status(500).json({message: 'Internal Server Error'});
          }

          return res.status(200).json(result);
        });

        break;
      case 'POST':

        // Yeni ürün ekle
        const {name, price, stock, gender, location, no, model} = body.data;

        db.query('INSERT INTO product SET ?', {
          name,
          price,
          stock,
          gender,
          location,
          no,
          model
        }, (err: any, result: any) => {
          if (err) {
            console.error('Ürün eklenirken bir hata oluştu:', err);
            return res.status(500).json({message: 'Internal Server Error'});
          }

          const insertedId = result.insertId;
          return res.status(201).json({message: 'Ürün başarıyla eklendi', id: insertedId});
        });

        break;

      default:
        return res.status(405).json({message: 'Method Not Allowed'});
    }
  } catch (error) {
    return res.status(500).json({message: error});
  }
}
