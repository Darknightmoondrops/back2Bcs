import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt-nodejs';
import UserModel, { User } from '../models/user.model';
import { generateToken } from '../utils';
const userRouter = express.Router();
// Create a new user (Sign Up)
userRouter.post(
    '/signUp',
    // Validate request body
    async (req: Request, res: Response) => {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
        // }
        const {
            name,
            lastName,
            companyName,
            email,
            phoneNumber,
            password,
            userAgent
        } = req.body;

        try {
            // Check if user with same email or phone number already exists
            const existingUser = await UserModel.findOne({
                $or: [{ email }, { phoneNumber }],
            });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash the password before saving it to the database
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            // Create a new user object with the hashed password
            const user: User = new UserModel({
                name,
                lastName,
                professionalTitle: " ",
                companyName,
                email,
                phoneNumber,
                password: hashedPassword,
                create_at: Date.now(),
                role: "Customer",
                uid: " ",
                address: " ",
                postalCode: " ",
            });
            // Save the new user to the database
            const newUser = await user.save();
            const userToken = {
                name: user.name,
                lastName: user.lastName,
                companyName: user.companyName,
                email: user.email
            }
            res.status(201).json({
                message: 'Sign-up successful!', user: {
                    name: user.name,
                    lastName: user.lastName,
                    companyName: user.companyName,
                    phone: user.phoneNumber,
                    email: user.email,
                    publicKey: " ",
                    token: generateToken(userToken)
                }
            });
        } catch (err: any) {
            res.status(500).json({ err });
        }
    }
);
// sign In user :
userRouter.post("/signIn", async (req: Request, res: Response) => {
    const { emailOrPhoneNumber, password } = req.body;

    try {
        // Find a user with the given email or phone number
        const user = await UserModel.findOne({
            $or: [{ email: emailOrPhoneNumber }],
        });

        // If user is not found, return an error
        if (!user) {
            return res.status(401).json({ message: "Invalid email!" });
        }

        // Compare the password with the hashed password in the database
        const isMatch = bcrypt.compareSync(password, user.password);

        // If passwords don't match, return an error
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password!" });
        }
        // Return the token and user information
        const userToken = {
            name: user.name,
            lastName: user.lastName,
            companyName: user.companyName,
            email: user.email
        }
        return res.json({
            message: "Signed in successfully",
            name: user.name,
            lastName: user.lastName,
            companyName: user.companyName,
            phone: user.phoneNumber,
            email: user.email,
            publicKey: " ",
            token: generateToken(userToken)
        });
    } catch (err: any) {
        return res.status(500).json({ err });
    }
});

export default userRouter;