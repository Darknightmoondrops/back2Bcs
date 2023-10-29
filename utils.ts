import jwt from "jsonwebtoken";
interface UserJwt {
    name: string
    lastName: string
    companyName: string
    email: string
}
export const generateToken = (user: UserJwt): string => {
    return jwt.sign(
        {
            name: user.name,
            lastName: user.lastName,
            companyName: user.companyName,
            email: user.email,
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "12h",
        }
    );
};