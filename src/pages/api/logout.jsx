import withSession from "@/lib/session";
import { auth } from "../../../firebase.config";

export default withSession(async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Clear the user's session
      await req.session.destroy();
      auth.signOut()

      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout failed:", error);
      res.status(500).json({ error: "Failed to logout" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
});
