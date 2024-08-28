import jwt from "jsonwebtoken"
import User from "../models/users.js";

export default async function validationMiddleware(request, response, next) {
    try {
        //decrypt jwt
        const decryptedToken = jwt.verify(request.headers.authorization, process.env.SECRET_KEY);

        //get user from ID that was in jwt
        const user = await User.findById(decryptedToken.id);
        if (!user) {
            throw new error("ID from JWT doesn't response to User in database");
        }

        //provides us with a deconstructed naming convention for use in our backend
        request.user = user;
    } catch (error) {
        response.status(500).send({
            message: error.message
        })
    }

    return next();
}