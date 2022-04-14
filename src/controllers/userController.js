const db = require("../config/db");
const User = db.users;
const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const _p = require("../utils/promise_errors");

const bcrypt = require("bcryptjs");
// const generateToken = require("../utils/generateToken");

const signupValidator = [
  check("name").exists(),
  check("email").isEmail(),
  check("password").isLength({ min: 5 }),
];
router.post("/signup", signupValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let { name, email } = req.body;

  let [ucErr, userCreated] = await _p(
    User.create({
      name,
      email,
      password: bcrypt.hashSync(req.body.password, 8),
    })
  );
  if (ucErr && !userCreated) {
    res.status(400).json({ error: true, message: ucErr.message });
  } else {
    res.json({ error: false, message: "User created" });
  }
});

module.exports = router;
