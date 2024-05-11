import { Request, Response } from "express";
import { IncomingForm } from "formidable";
import fs from "fs";
import db from "../../../configs/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function uploadFormFiles(req: Request, res: Response) {
  // Yeni bir IncomingForm örneği oluştur
  const form = new IncomingForm({
    multiples: false,
    keepExtensions: true,
    uploadDir: "public/images/product", // Dosyaların kaydedileceği dizin
  });

  // Formu analiz et
  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      console.error("Error parsing form data:", err);
      return res.status(500).send("Error parsing form data");
    }



    // Gelen dosya yoksa hata gönder
    if (!files || !files.file) {
      return res.status(400).send("No file uploaded");
    }

    // İstekten gelen ürün ID'sini al
    const { id } = fields;


    try {
      // Ürünü veritabanından al

      db.query('SELECT * FROM product WHERE id=?', [id], async (err: any, result: any) => {
        if (err) {
          console.error('Ürünler getirilirken bir hata oluştu:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        // Veritabanında ürün bulunamazsa hata gönder
        if (!result[0]) {
          return res.status(404).send("Product not found");
        }

        try {
          // Eski dosyanın yolunu al ve dosyayı sil
          if (result[0].file_path && fs.existsSync(`public${result[0].file_path}`)) {
            const productImagePath = `public${result[0].file_path}`;
            await fs.promises.unlink(productImagePath);
          }

          // Yeni dosyanın yolunu ve adını al
          const { filepath,newFilename } = files.file[0];

          const newFilePath = `public/images/product/${newFilename}`;

          // Dosyayı taşı ve adını değiştir
          fs.renameSync(filepath, newFilePath);

          // Dosyanın yolunu veritabanında güncelle
          console.log("newFilePath",newFilePath)
          const updateResult = await db.query("UPDATE product SET file_path = ? WHERE id = ?", [
            newFilePath.toString().replace("public", ""),
            id,
          ]);

          // Başarılı yanıt gönder
          return res.status(201).send("File uploaded and product updated successfully");
        } catch (error) {
          console.error("Error processing file:", error);
          return res.status(500).send("Error processing file");
        }
      });






    } catch (error) {
      console.error("Error processing file:", error);
      return res.status(500).send("Error processing file");
    }
  });
}
