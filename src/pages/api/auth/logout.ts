import { setCookie } from "cookies-next";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      res.setHeader(
        "Set-Cookie",
        `token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      );

      return res.status(200).json({ message: "Logout successful!" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  } else {
    res.status(424).json({ message: "Invalid method!" });
  }
}
