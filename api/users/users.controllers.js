const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { JWT_SECRET, JWT_TOKEN_EXP } = process.env;

exports.signup = async (req, res, next) => {
  const { password } = req.body;
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body);
    const token = generateToken(newUser);

    res
      .status(201)
      .json({ message: "User created successfully", token: token });
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "unathentication" });
  try {
    const token = generateToken(user);
    return res.status(200).json({ token });
  } catch (err) {
    res.status(500).json("Server Error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("urls");
    res.status(201).json(users);
  } catch (err) {
    next(err);
  }
};

function generateToken(user) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_TOKEN_EXP = process.env.JWT_TOKEN_EXP;
  const payload = {
    _id: user._id,
    username: user.username,
  };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_TOKEN_EXP,
  });
  return token;
}
