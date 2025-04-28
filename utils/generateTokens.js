import jwt from 'jsonwebtoken';

export const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
         expiresIn: "15d" 
        });
}