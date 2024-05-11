import db from "../../../configs/db";


const secretKey: any = process.env.JWT_SECRET_KEY;

export default async function handler(req: any, res: any) {
    const { method, body, query } = req;

    // Token kontrolü
    const token = req.cookies.token;

    /*if (!token) {
        return res.status(401).json({ message: 'Yetkisiz Erişim.Token Yok' });
    }*/


    try {

        switch (method) {
            case 'GET':
                if (query && query.id) {
                    // Tek bir ürünü getir
                    db.query('SELECT * FROM product WHERE id = ?', [query.id], (err: any, result: any) => {
                        if (err) {
                            console.error('Ürün getirilirken bir hata oluştu:', err);
                            return res.status(500).json({ message: 'Internal Server Error' });
                        }

                        if (result.length === 0) {
                            return res.status(404).json({ message: 'Ürün bulunamadı' });
                        }

                        return res.status(200).json(result[0]);
                    });
                }
                break;
            case 'PUT':
                // Rol kontrolü

                // Ürün güncelle
                const { name, price, stock, gender, location, no, model } = body.data;



                // Veritabanında ilgili ürünü güncelleme işlemi
                db.query('UPDATE product SET name = ?, price = ?, stock = ? , gender = ?, location = ?, no = ?, model = ? WHERE id = ?', [name, price,stock,gender, location, no, model, query.id], (err: any, result: any) => {
                    if (err) {
                        console.error('Ürün güncellenirken bir hata oluştu:', err);
                        return res.status(500).json({ message: 'Internal Server Error' });
                    }

                    return res.status(200).json({ message: 'Ürün başarıyla güncellendi' });
                });
                break;
            case 'DELETE':

                // Ürün sil
                const productId = query.id;

                if (!productId) {
                    return res.status(400).json({ message: 'Lütfen tüm alanları doldurun!' });
                }

                // Veritabanında ilgili ürünü silme işlemi
                db.query('DELETE FROM product WHERE id = ?', [productId], (err: any, result: any) => {
                    if (err) {
                        console.error('Ürün silinirken bir hata oluştu:', err);
                        return res.status(500).json({ message: 'Internal Server Error' });
                    }

                    return res.status(200).json({ message: 'Ürün başarıyla silindi' });
                });
                break;
            default:
                return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
}
