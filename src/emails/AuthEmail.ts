import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'SkillUp <admin@pass.com>',
            to: user.email,
            subject: 'Confirma tu cuenta en SkillUp',
            text: 'Confirma tu cuenta en SkillUp',
            html: `<p>Hola ${user.name}, has creado tu cuenta en SkillUp, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
            <p>Visita el siguiente enlace para confirmar tu cuenta:</p>\
            <a href='${process.env.FRONTEND_URL}/auth/confirm-account'>Confirmar cuenta</a>
            <p>Ingresa el siguiente codigo: <b>${user.token}</b></p>
            <p>Este token expira en 10 minuto</p>
            `
        })

        console.log('Mensaje enviado', info.messageId);
    }
    static sendPasswordResetToken = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'TaskLy <admin@pass.com>',
            to: user.email,
            subject: 'TaskLy - Reestablece tu password',
            text: 'TaskLy - reestablece tu password',
            html: `<p>Hola ${user.name}, has solicitado reestablecer tu password</p>
            <p>Visita el siguiente enlace:</p>\
            <a href='${process.env.FRONTEND_URL}/auth/new-password'>Reestablecer Password</a>
            <p>E ingresa el codigo: <b>${user.token}</b></p>
            <p>Este token expira en 10 minuto</p>
            `
        })

        console.log('Mensaje enviado', info.messageId);
    }
}