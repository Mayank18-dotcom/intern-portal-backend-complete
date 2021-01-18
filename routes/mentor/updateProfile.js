var Admin = require("../../models/admin");
module.exports = async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ["username", "email", "password", "regno"];
      const isValidOperation = updates.every(element =>
        allowedUpdates.includes(element)
      );
      if (!isValidOperation) res.status(400).send({ error: "Invalid updates" });
      updates.forEach(element => (req.admin[element] = req.body[element]));
      await req.admin.save();
      res.json(req.admin);
    } catch (error) {
      res.status(400).send(error);
    }
  }