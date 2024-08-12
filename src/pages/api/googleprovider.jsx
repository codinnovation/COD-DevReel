import withSession from "@/lib/session";
import { auth, googleProvider } from "../../../firebase.config";
import { signInWithPopup } from "firebase/auth";

export default withSession(async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    req.session.set("user", user);
    await req.session.save();

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
