

// import { faker } from "@faker-js/faker";
import { hash, verify } from "argon2";
import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";
import { UserFields } from "../utils/user.utils.js";
import { generateToken } from "./generate-token.js";


// @desc    Auth user
// @route   POST /api/auth/login
// @access  Public

export const authUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await prisma.parents.findFirst({
        where: {
            email
        }
    }
    )

    const isValidPassword = await verify(user.password, password)

    if (user && isValidPassword) {
        const token = generateToken(user.id)
        res.json({ user, token })
    } else {
        res.status(401)
        throw new Error('Email and password are not correct')
    }


    res.json(user);
})


// @desc    Register user
// @route   POST /api/auth/register
// @access  Public

export const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { email, password, login } = req.body

    const isHaveUser = await prisma.parents.findFirst({
        where: {
            email
        }
    })

    if (isHaveUser) {
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await prisma.parents.create({
        data: {
            email,
            password: await hash(password),
            login,
            hash: '1212'
        }
        // ,
        // select: UserFields
    })


    const token = generateToken(user.id)

    res.json({ user, token });
})