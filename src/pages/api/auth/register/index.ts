import db from "../../../../configs/db";
import bcrypt from "bcrypt";

export default async function handler(req: any, res: any) {
  const {method, body} = req;



  try {

    switch (method) {
      case 'POST':

        // Yeni kullanıcı ekle
        const {name, surname, email, password} = body;

        const isUserExist = await db.query('SELECT * FROM user WHERE email = ?', [email]);
        if (isUserExist.length > 0) {
          return res.status(409).json({message: 'Bu e-posta adresi ile kayıtlı bir kullanıcı bulunmaktadır.'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO user SET ?', {
          name,
          surname,
          email,
          password: hashedPassword,
          role: 0
        }, (err: any, result: any) => {
          if (err) {
            console.error('Kullanıcı eklenirken bir hata oluştu:', err);
            return res.status(500).json({message: 'Internal Server Error'});
          }

          return res.status(201).json({message: 'Kullanıcı başarıyla eklendi'});
        });

        break;

      default:
        return res.status(405).json({message: 'Method Not Allowed'});
    }
  } catch (error) {
    return res.status(500).json({message: error});
  }
}
