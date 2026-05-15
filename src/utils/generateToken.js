import jwt from 'jsonwebtoken';



const generateToken = (payload) => {

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is missing');
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

export default generateToken;