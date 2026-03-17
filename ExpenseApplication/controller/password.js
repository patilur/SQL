const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const User = require('../model/signupModel');
const ForgotPassword = require('../model/forgotPassword');

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate token
        const token = uuidv4();

        await ForgotPassword.create({
            id: token,
            userId: user.id,
            isActive: true
        });

        // Setup email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,          // your email
                pass: process.env.EMAIL_PASSWORD  // app password
            }
        });

        const resetLink = `http://localhost:3000/password/resetpassword/${token}`;

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Reset Your Password",
            html: `
                <h3>Password Reset</h3>
                <p>Click below link to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
            `
        });

        res.status(200).json({ message: "Reset link sent successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};