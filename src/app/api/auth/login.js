import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectMongo from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectMongo();
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      // Check password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid credentials" });

      // Create JWT
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
