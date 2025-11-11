import { Request, Response } from "express"
import bcrypt from "bcrypt"
import User from "../models/User";
import { hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";


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
            //Se crea el usuario
            const user = new User(req.body)
            //hashear el password
            user.password = await hashPassword(password)
            //Generar token de confirmacion
            const token = new Token()
            token.token = generateToken() // primer token es la variable, .token es el campo del schema
            token.user = user.id // al user del schema le asignamos el id generado por mongoose, para crear una cuenta nueva
            //enviar email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            res.send('Cuenta creada, verifica tu email para confirmarla')
        } catch (error) {
            res.status(500).json({ error: 'Error al crear la cuenta' });

        }

    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body;

            const tokenExist = await Token.findOne({ token });
            if (!tokenExist) {
                const error = new Error('Token no valido');
                res.status(401).json({ error: error.message })
                return;
            }

            const user = await User.findById(tokenExist.user)
            user.confirmed = true;

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])
            res.json('cuanta confirmada correctamente');

        } catch (error) {
            res.status(500).json({ error: 'Error al crear la cuenta' });
        }

    }



}