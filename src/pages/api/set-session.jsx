import withSession from "@/lib/session";

export default withSession(async (req, res) => {
   if (req.method === "POST") {
     const { user } = req.body;
 
     // Save user data in the session
     req.session.set("user", {
       uid: user.uid,
       email: user.email,
       displayName: user.displayName,
       photoURL: user.photoURL,
     });
 
     await req.session.save();
     res.status(200).json({ message: "Session set successfully" });
   } else {
     res.status(405).json({ message: "Method not allowed" });
   }
 });