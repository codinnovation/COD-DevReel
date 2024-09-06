import { createUserWithEmailAndPassword, updateProfile, updatePhoneNumber } from "firebase/auth";
import withSession from "@/lib/session";
import { auth } from "../../../firebase.config";

export default withSession(async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, name } = req.body;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {displayName: name})

      const user = {
        id: userCredential.user.id,
        email: userCredential.user.email,
        displayName: userCredential.displayName,
      };

      req.session.set("user", user);
      await req.session.save();

      res.status(200).json({ user: userCredential.user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(404).end();
  }
});
