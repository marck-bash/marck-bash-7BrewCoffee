import User from "../models/users.js";
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import adminPermissionMiddleware from "../middleware/permissionsMiddleware.js";

import "dotenv/config";
import nodemailer from "nodemailer"

import validationMiddleware from "../middleware/validationMiddleware.js";

const router = Router();

//Manager/Admin signup endpoint (For store manager/Admin use, will require admin check middleware)
router.post("/addAdmin", adminPermissionMiddleware, async (request, response) => {
    try {
        //checks to see if the user exists
        const doesUserExist = await User.exists({
            email: request.body.email
        });
        if (doesUserExist === null) {
            const user = new User({
                employeeID: request.body.employeeID,
                createdBy: request.user.email,
                firstName: request.body.firstName,
                middleName: request.body.middleName,
                lastName: request.body.lastName,
                role: request.body.role,
                storeLocation: request.body.storeLocation,
                brewistas: request.body.brewistas,
                email: request.body.email,
                password: request.body.password
            });
            
            await user.save();
            
            response.send({
                message: "Success"
            });
        } else {
            response.status(500).send({
                message: "Email is already in use"
            });
        }
    } catch (error) {
        response.status(500).send({
            message: error.message
        });
    };
});

//User login endpoint
router.post("/login", async (request, response) => {
    
    const user = await User.findOne({ email: request.body.email })
    
    if(!user) {
        response.status(401).json({message: "The username or password is incorrect"});
    }
    if(user) {
        bcrypt.compare(request.body.password, user.password, (err, res) => {
            if(res) {
                const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
                response.status(200).json({
                    message: "Success",
                    token
                })
            } else {
                response.status(401).json({
                    message:"The username or password is incorrect"
                })
            }
        })
    }
});

//Employee account creation (For store manager use, will require admin check middleware)
router.post("/addEmployee", adminPermissionMiddleware, async (request, response) => {
    try {
        //checks to see if the user exists
        const doesUserExist = await User.exists({
            email: request.body.email
        });
        if (doesUserExist === null) {
            const user = new User({
                employeeID: request.body.employeeID,
                createdBy: request.user.email,
                firstName: request.body.firstName,
                middleName: request.body.middleName,
                lastName: request.body.lastName,
                role: request.body.role,
                storeLocation: request.body.storeLocation,
                email: request.body.email,
                password: request.body.password
            });
            
            await user.save();
            
            response.send({
                message: "Success"
            });
        } else {
            response.status(500).send({
                message: "Email is already in use"
            });
        }
    } catch (error) {
        response.status(500).send({
            message: error.message
        });
    };
});


//Returns all users that are found in the database, will be used to filter the users by store location on the front end
router.get("/allusers", adminPermissionMiddleware, async (request, response) => {
    try {
        const allUsers = await User.find({});
        response.send(allUsers);
    } catch (error) {
        response.status(500).send({
            message: error.message
        });
    };
});

//Endpoint to allow user profiles to be updated by an admin / manager
router.put("/allusers/:_id", adminPermissionMiddleware, async (request, response) => {
    
    try {
        const doesUserExist = await User.exists({
            email: request.body.email
        });
        const filter = { _id: request.params._id };
        const update = request.body;
        if (doesUserExist === null) {
            const editUser = await User.findOneAndUpdate(filter, update, {new: true})
            response.send(editUser)
        } else if (doesUserExist._id.toString() === filter._id.toString()) {
            const update = request.body;
            const editUser = await User.findOneAndUpdate(filter, update, {new: true})
            response.send(editUser)
        } else {
            response.status(500).send({
                message: "Email is already in use"
            })
        }
    } catch (error) {
        response.status(500).send({
            message: error.message
        });
    }
    })

router.post("/forgotPassword", async (request, response) => {
    try {
        console.log(request.body.email)
        const user = await User.findOne({ email: request.body.email })
        console.log(user)
        if (user) {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // use SSL
            auth: {
              user: process.env.EMAIL_USERNAME, //sender gmail address
              pass: process.env.APP_PASSWORD, // App password from Gmail account
            },
          });
        
          // Configure the mailoptions object
          
          const mailOptions = {
            from: "7brewnoreplytest@gmail.com",
            to: request.body.email,
            subject: "please reset password here:",
            html: `<p>Click <a href='http://localhost:5173/user/newPassword/${user._id}'>here</a> to reset your password</p>`
            
          };
        
          const sendMail = async (transporter, mailOptions) => {
            try {
              await transporter.sendMail(mailOptions);
              console.log("Email has been sent");
            } catch (error) {
              console.error(error);
            }
          };
        
          sendMail(transporter, mailOptions);
        
          // verify connection configuration
          transporter.verify(function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log("Server is ready to take our messages");
              response.status(200).send({
                message: "Recovery email sent succesfully"

            });
            }
          });
        } else {
            response.status(500).send({
                message: "Email is not in database"

            });
        }
    } catch (error) {
        response.status(500).send({
            message: error.message
        });
    };
});


//Endpoint to allow user profiles to be deleted by an admin / manager
router.delete("/allusers/:_id", adminPermissionMiddleware, async (request, response) => {
    try {
        const userDelete = await User.deleteOne({ _id: request.params._id })
        response.send(userDelete);
    } catch (error) {
        response.status(500).send({
            message: error.message
        });
    };
});

//Returns the user who's ID matches the _id found in the parameter
router.get("/edit/:_id", validationMiddleware, async (request, response) => {
    try {
        const currentUser = await User.find({ _id: request.user._id });
        response.send(currentUser);
    } catch (error) {
        response.status(500).send({
            message: error.message
        });
    };
});

//route for editing currently logged in user, (required due to the difference in middleware between the Admin edit and this ediit)
router.put("/edit/:_id", validationMiddleware, async (request, response) => {
    try {
        //checks to see if the user exists
        const doesUserExist = await User.exists({
            email: request.body.email
        });
        const filter = { _id: request.params._id };
        const update = request.body;
        if (doesUserExist === null) {
            const editUser = await User.findOneAndUpdate(filter, update, {new: true})
            response.send(editUser)
        } else if (doesUserExist._id.toString() === filter._id.toString()) {
            const update = request.body;
            const editUser = await User.findOneAndUpdate(filter, update, {new: true})
            response.send(editUser)
        } else {
            response.status(500).send({
                message: "Email is already in use"
            });
        }
    } catch (error) {
        response.status(500).send({
            message: error.message
        });
    }
})

router.post("/resetPassword/:_id", async (request, response) => {
    const requestedUser = await User.findById(request.params._id)
    console.log("TEST")
    try {
        console.log(request.body.password)
        // if (request.body.password === request.body.confirmPassword) {
            const user = requestedUser
            user.password = request.body.password
        await user.save();
        console.log("TEST8")
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        response.status(200).json({
            message: "Success",
            token
        })
        console.log("test9")
        // } else {
        //     console.log("test5")
        //     response.status(500).send({
        //         message: "Passwords do not match"
        //     });
        // }
    } catch (error) {
        console.log("test6")
        response.status(500).send({
            message: error.message
        });
    }
})

// get user info
router.get("/user", validationMiddleware, (request, response) => {
    try {
        const userInfo = {
            firstName: request.user.firstName,
            lastName: request.user.lastName,
            email: request.user.email,
            userId: request.user._id,
            role: request.user.role
        }

        response.send({
            userInfo
        });
    }
    catch(err) {
        response.status(500).send({
            message: err.message
        });
    }
});

// get user role
router.get("/user/role", validationMiddleware, async (request, response) => {
    try {
        const currentUser = await User.find({
            _id: request.user._id
         });
        response.send(currentUser);
    } catch (error) {
        response.status(500).send({
            message: err.message
        });
    }
})


export default router;