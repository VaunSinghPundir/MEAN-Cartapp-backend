const { Router } = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = Router();

// router.post("/register", async (req, res) => {
//   let email = req.body.email;
//   let password = req.body.password;
//   let name = req.body.name;
//   const salt = await bcrypt.genSalt(10);
//   const hashpassword = await bcrypt.hash(password, salt);

//   const record = await User.findOne({ email: email });
//   if (record) {
//     return res.status(400).json({
//       message: "Email already exists",
//     });
//   } else {
//     const user = new User({
//       email: email,
//       password: hashpassword,
//       name: name,
//     });
//   }
//   const user = new User({
//     email: email,
//     password: hashpassword,
//     name: name,
//   });

//   const result = await user.save();

//   //jwt token
//   const { _id } = await result.toJSON();
//   const token = jwt.sign({ _id: _id }, "secret");

//   res.cookie("jwt", token, {
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000,
//   });

//   res.json({
//     message: "Success"
//   });

//   res.json({
//     user: result,
//   });
// });
router.post("/register", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let name = req.body.name;
  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(password, salt);

  const record = await User.findOne({ email: email });
  if (record) {
    return res.status(400).json({
      message: "Email already exists",
    });
  } else {
    const user = new User({
      email: email,
      password: hashpassword,
      name: name,
    });

    const result = await user.save();

    //jwt token
    const { _id } = await result.toJSON();
    const token = jwt.sign({ _id: _id }, "secret");

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Success",
      user: result,
    });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send({
      message: "User not found",
    });
  }

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).send({
      message: "Password is incorrect",
    });
  }

  const token = jwt.sign({ _id: user._id }, "secret key");

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // for 1 day
  });

  res.send({
    message: "success",
  });
});

router.get("/user", async (req, res) => {
  res.send({ message: "success"})
  try {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, "secret");
    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const { _id } = decoded;
    const user = await User.findById(_id);
    const { password, ...data } = await user.toJSON();
    res.json({
      user: data,
    });
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
});
router.post("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });

  res.send({
    message: "success",
  });
});

module.exports = router;
