import express, { Router } from "express";
import { body, param } from "express-validator";
import { CouseController } from "../controllers/CousesController";
import { handleInputErrors } from "../middleware/validation";

const router = Router()


/** Routes for courses */ 

router.post('/',
    body('courseName')
        .notEmpty().withMessage('El nombre del curso es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion del curso es obligatoria'),
    body('department')
        .notEmpty().withMessage('El departamento del curso es obligatorio'),

    handleInputErrors,
    CouseController.createCourse
)

router.get('/', CouseController.getAllCourses)

router.get('/:id',
    param('id').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    CouseController.getCourseById
)

router.put('/:id',
    param('id').isMongoId().withMessage('ID no valido'),

    body('courseName')
        .notEmpty().withMessage('El nombre del curso es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion del curso es obligatoria'),
    body('department')
        .notEmpty().withMessage('El departamento del curso es obligatorio'),


    handleInputErrors,
    CouseController.updateCourse
)
router.delete('/:id',
    param('id').isMongoId().withMessage('ID no valido'),


    handleInputErrors,
    CouseController.deleteCourse
)


/**Routes for sections */





export default router;