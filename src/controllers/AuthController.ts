import { Request, Response } from "express"
import bcrypt from "bcrypt"
import User from "../models/User";
import { hashPassword } from "../utils/auth";



export class AuthController {



    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body;

            //prevenir duplicados
            const userExist = await User.findOne({ email })
            if (userExist) {
                const error = new Error('El usuario ya esta registrado')
                res.status(409).json({ error: error.message })
                return;
            }

            const user = new User(req.body)

            //hashear el password
            user.password = await hashPassword(password)
            await user.save();

            res.send('Cuenta creada, verifica tu email para confirmarla')
        } catch (error) {
            res.status(500).json({ error: 'Error al crear la cuenta' });

        }

    }



}