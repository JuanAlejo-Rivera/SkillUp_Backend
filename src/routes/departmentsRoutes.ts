import { Router } from "express";
import { body } from "express-validator";
import { DeparmentsController } from "../controllers/DeparmentsController";
import { handleInputErrors } from "../middleware/validation";


const router = Router()


/**Routes departments */

router.post('/',
    body('departmentName')
        .notEmpty().withMessage('El nombre del departamento es obligatorio'),

    handleInputErrors,
    DeparmentsController.createDepartment
)

router.get('/', DeparmentsController.getDepartments)

export default router;
