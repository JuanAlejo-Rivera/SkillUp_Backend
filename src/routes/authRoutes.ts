import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";

const router = Router();


router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio'),
    body('password')
        .isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Los passwords no son iguales');
        }
        return true;
    }),
    body('email')
        .isEmail().withMessage('E-mail no válido'),

    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('El token es obligatorio'),
    handleInputErrors,
    AuthController.confirmAccount

)

router.post('/login',
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    body('password')
        .notEmpty().withMessage('El password es obligatorio'),
    handleInputErrors,
    AuthController.login

)

export default router;


