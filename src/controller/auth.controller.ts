import express, { Request, Response } from "express";
import MessageResponse from "../interfaces/MessageResponse";
import jwt_decode from "jwt-decode";
import dbBlog from "../config/dbBlog";
import { User } from "../model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { reqRegister } from "../interfaces/auth.type";
import moment from "moment";
const secret:any = process.env.SECRET_KEY ;
const saltRounds = 10;

export const LoginController = async (req: Request, res: Response) => {
  try {
    const checkLogin = await dbBlog<User>("user")
      .where("username", req.body.username)
      .select("*");
    if (checkLogin.length > 0) {
      return bcrypt
        .compare(req.body.password, checkLogin[0].password)
        .then((result: any) => {
          if (!result) {
            res.status(301).json({
              status: 301,
              results: "noPassword",
            });
          } else {
            // let jwtToken = jwt.sign(checkLogin[0], secret, {
            //   expiresIn: "1h",
            // });
            let jwtToken = jwt.sign(checkLogin[0], secret);
            return res.json({
              status: 200,
              token: jwtToken,
              // results: checkLogin[0],
            });
          }
        })
        .catch((error: any) => {
          res.status(401).json({
            message: "Authentication failed",
            error: error,
          });
        });
    } else {
      return res.status(301).json({ status: 301, results: "noUsername" });
    }
  } catch (error: any) {
    return res.json({ status: 500, results: error.message });
  }
};

export const Register = async (req: Request, res: Response) => {
  const form: reqRegister = req.body;
  try {
    const checkUsername = await dbBlog<User>("user").where(
      "username",
      form.username
    );
    if (checkUsername.length > 0) {
      return res.json({ status: 301, results: "user used" });
    } else {
      bcrypt
        .hash(form.password, saltRounds)
        .then(async (hash: any) => {
          const insertUser = await dbBlog<User>("user").insert({
            username: form.username,
            password: hash,
            p_name: form.p_name,
            f_name: form.f_name,
            l_name: form.l_name,
            avatar: form.avatar,
            email: form.email,
            sex: form.sex,
            role: form.role,
            create_at: moment().format("YYYY-MM-DD HH:MM:ss"),
          });
          return res.json({ status: 200, results: insertUser });
        })
        .catch((err: any) => {
          console.error(err.message);
          return res.json({ status: 500, results: err.message });
        });
    }
  } catch (error: any) {
    return res.json({ status: 500, results: error.message });
  }
};

export const MeController = async (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    var decoded = jwt_decode(token);
    res.json({ status: 200, results: decoded });
  } catch (error: any) {
    res.status(500).json({ status: 500, results: error.message });
  }
};
