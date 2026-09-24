import bcrypt from "bcrypt";
import Student from "../models/student.model.js";
import jwt from "jsonwebtoken";
// import { JsonWebTokenError } from "jsonwebtoken";

// REGISTER CONTROLLER

const register = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).send("all field are required");
    }

    const hashedPassword = await bcrypt.hash(password, 13);

    const student = await Student.create({
      name,
      email,
      role: "user",
      password: hashedPassword,
    });

    const studentData = student.toObject();

    delete studentData.password;

    res.status(201).send({
      message: "Student created successfully",
      data: studentData,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

//LOGIN CONTROLLER

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const student = await Student.findOne({
    email,
  });

  if (!student) {
    return res.status(400).send({
      message: "Student not found",
    });
  }

  const isMatch = await bcrypt.compare(password, student.password);

  if (!isMatch) {
    const error = new Error("Incorrect Password");
    error.statusCode = 401;
    throw error;
  }
  const payload = {
    id: student._id,
    email: student.email,
    role: student.role,
  };

  const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

  student.refreshToken = hashedRefreshToken;
  await student.save();

  const studentData = student.toObject();

  (delete studentData.password, delete studentData.refreshToken);

  return res.send({
    message: "Login Successful",
    token: {
      accessToken,
      refreshToken,
    },
    data: studentData,
  });
};

// PROFILE CONTROLLER

const profile = async (req, res, next) => {
  const student = await Student.findById(req.user.id);

  const studentData = student.toObject();

  delete studentData.password;

  res.status(200).send({
    studentData,
  });
};

//ADMIN TEST

const adminTest = (req, res) => {
  let data = req.user;
  let role = req.user.role;
  let name = data.email.split("@")[0];

  console.log(name);

  res.send({
    message: `welcome ${role}! ${name}`,
  });
};

//REFRESH TOKEN

const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // checking whether token is made by valid token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

    const student = await Student.findById(decoded.id);

    if (!student) {
      return res.status(401).send({
        message: "Student not found",
      });
    }

    // checking if hashed token is made from same token
    const isRefreshTokenValid = bcrypt.compare(
      refreshToken,
      student.refreshToken,
    );

    if (!isRefreshTokenValid) {
      return res.status(401).send({
        message: "Invalid Token ",
      });
    }

    const newAccessToken = jwt.sign(
      // new access token
      {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "15m",
      },
    );

    const newRefreshToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
      process.env.REFRESH_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );

    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 12);

    student.refreshToken = hashedNewRefreshToken;
    await student.save();

    return res.status(200).send({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

// LOGOUT CONTROLLER

const logout = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.id);
    student.refreshToken = null;
    await student.save();
    return res.status(200).send({
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

export { register, login, profile, adminTest, refreshAccessToken, logout };
