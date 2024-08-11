import withSession from "@/lib/session";

export default withSession(async (req, res) => {
  if (req.method === "POST") {
    const { user } = req.body;

    // Set the session with user data
    req.session.set("user", { user });
    await req.session.save();
    res.status(200).json({ message: "Session set successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
});
