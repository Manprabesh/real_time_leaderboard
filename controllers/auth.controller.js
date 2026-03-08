import { OAuth2Client } from "google-auth-library";
import { google } from 'googleapis'
import nodemailer from "nodemailer"
import configRedis from "../configs/redis.config.js";
import crypto from "crypto"
import bcrypt from "bcrypt"
import generateToken from "../utils/jwt.js"
import {
    GET_USER_BY_EMAIL,
    GET_USER_BY_LIMIT_OFFSET,
    GET_USER_SCORE_GAME_BY_LIMIT_OFFSET,
    GET_USER_PROFILE,
    DELETE_USER
} from "../db/query.js"
import { db } from "../server.js";
import { redisClient } from "../server.js";

export const signUp = async (req, res) => {
    try {
        const { email, password } = req.body;


        //search if the email exist or not
        const insertQuery = {
            text: `SELECT email FROM users where email = $1`,
            values: [email]
        }

        const { rows } = await db.query(insertQuery);
        // console.log("result ", rows);
        if (rows[0]) {
            // console.log("rowss", rows);
            return res.status(409).json({ message: "user exist with this credentials" })
        }

        //generate OTP
        function generateOTP() {
            const otp = crypto.randomInt(100000, 1000000);
            return otp.toString();
        }

        const OTP = generateOTP();
        console.log("your OTP is ", OTP);

        const client = await configRedis();
        // console.log("client", client);

        //hash password
        const SALT_ROUNDS = 10; // 10–12 recommended

        async function hashPassword(password) {
            return await bcrypt.hash(password, SALT_ROUNDS);

        }
        const hPassword = await hashPassword(password);
        console.log("hashpassword", hPassword)

        await client.set(`otp:${email}`, OTP);
        await client.set(`register:${email}`, JSON.stringify({ email, hPassword }));


        //configuring nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "monboruah0986@gmail.com",
                pass: process.env.GOOGLE_APP_PASSWORD,
            },
        });

        const message = {
            from: "monboruah0986@gmail.com",
            to: email,
            subject: "OTP sent",
            text: `you one time password is ${OTP}`,
            html: `you one time password is ${OTP}`,
        };

        const info = await transporter.sendMail(message);
        console.log("Email sent:", info.messageId);

        return res.status(200).json({ success: true, message: "OTP sent successfullt", email: email, otp: OTP });

    } catch (error) {
        console.log("error while creating new user", error);
        return res.status(501).json({ success: false, message: "Internal Server Error" });
    }
}

export const OTPverification = async (req, res) => {
    try {
        const { OTP, email } = req.body;

        const client = await configRedis();
        const result = await client.get(`otp:${email}`);
        const userData = JSON.parse(await client.get(`register:${email}`));

        //generate token


        console.log("user data", userData);
        console.log("Sender OTP is", OTP);
        console.log("Verification OTP is", result);

        if (result == OTP && email == userData.email) {
            //save in the database
            const insertQuery = {
                text: `INSERT INTO users(email, password) VALUES ($1, $2) RETURNING id, email;`,
                values: [email, userData.hPassword]
            }

            const { rows } = await db.query(insertQuery);
            console.log("data inserted", rows[0]);

            const token = await generateToken({ id: rows[0].id });

            client.del(`otp:${email}`);
            client.del(`register:${email}`)
            return res.status(201).json({
                message: "Account created successfully",
                success: true,
                token: token,
                id: rows[0].id,
                email: rows[0].email,
            });
        }
        else {
            return res.status(401).json({ success: false, message: "OTP don't match" });
        }
    } catch (error) {
        console.error("Error while verifying OTP", error)
        return res.status(501).json({ success: false, message: "Internal Server Error" })
    }
}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const insertQuery = {
            text: GET_USER_BY_EMAIL,
            values: [email]
        }

        const { rows } = await db.query(insertQuery);

        if (!rows[0]) {
            return res.status(409).json({
                message: "credential mismatch",
            })
        }

        async function comparePassword(password, hashedPassword) {
            return await bcrypt.compare(password, hashedPassword);
        }

        const isTrue = comparePassword(password, rows[0].password);

        if (isTrue) {
            // const token = await generateToken({ email });
            const token = await generateToken({ id: rows[0].id });


            return res.status(200).json({
                message: "user is valid",
                id: rows[0].id,
                email: rows[0].email,
                token: token
            })
        }
        else {
            return res.status(409).json({
                message: "credential mismatch",
            })
        }



    } catch (error) {
        console.log("error in signin", error);
        return res.status(500).json({ message: "Internal Server Error", error: error });
    }
}

//delete user 
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(DELETE_USER, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            success:true,
            message: "User deleted successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success:false,
            message: "Internal server error"
        });
    }
};

//list user with games & scores
export const listUser = async (req, res) => {
    try {
        const { limit, page } = req.params;

        const offset = (page - 1) * limit

        const result = await db.query(GET_USER_BY_LIMIT_OFFSET, [limit, offset]);

        // console.log("result", result.rows)
        let users = [];

        for (let i = 0; i < result.rows.length; i++) {
            const element = result.rows[i]['id'];
            console.log("element", element)

            const gameRes = await db.query(GET_USER_SCORE_GAME_BY_LIMIT_OFFSET, [element, limit, offset]);

            if (gameRes.rowCount != 0) {

                users.push({
                    [element]: gameRes.rows
                });
            }

        }

        return res.status(200).json({ success: true, data: users })

    } catch (error) {
        console.log("erroe", error)
        return res.status(501).json({ success: false, message: "Internal Server error" })
    }
}

//user profile 
export const userProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        const result = await db.query(GET_USER_PROFILE, [userId]);

        const games = result.rows;

        for (const game of games) {
            const rank = await redisClient.zRevRank(game.game_id.toString(), userId);
            game.rank = rank !== null ? rank + 1 : null;
        }

        return res.status(200).json({
            success: true,
            userId,
            games
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server error" });
    }
};