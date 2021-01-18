var User = require("../../models/user");
module.exports = async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ["username", "email", "password", "regno"];
      const isValidOperation = updates.every(element =>
        allowedUpdates.includes(element)
      );
      if (!isValidOperation) res.status(400).send({ error: "Invalid updates" });
      updates.forEach(element => (req.user[element] = req.body[element]));
      await req.user.save();
      res.json(req.user);
    } catch (error) {
      res.status(400).send(error);
    }
}