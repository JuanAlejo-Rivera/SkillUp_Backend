import { Router } from "express";
import { body } from "express-validator";
import { DepartmentsController } from "../controllers/DepartmentsController";
import { handleInputErrors } from "../middleware/validation";
import { param } from "express-validator";

const router = Router()


/**Routes departments */

router.post('/',
    body('departmentName')
        .notEmpty().withMessage('El nombre del departamento es obligatorio'),

    handleInputErrors,
    DepartmentsController.createDepartment
)

router.get('/', DepartmentsController.getDepartments)



router.delete('/:departmentId',
    param('departmentId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,

    DepartmentsController.deleteDepartment
)



export default router;