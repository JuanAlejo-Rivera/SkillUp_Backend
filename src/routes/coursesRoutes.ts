import express, { Router } from "express";
import { body, param } from "express-validator";
import { CouseController } from "../controllers/CousesController";
import { handleInputErrors } from "../middleware/validation";
import { SectionsController } from "../controllers/SectionsController";
import { validateCourseExists } from "../middleware/courses";
import { validateSectionExists } from "../middleware/section";
import { LeassonController } from "../controllers/LessonController";

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

router.param('courseId', validateCourseExists)
router.param('sectionId', validateSectionExists)

router.post('/:courseId/sections',
    body('title')
        .notEmpty().withMessage('El nombre del curso es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion del curso es obligatoria'),

    handleInputErrors,
    SectionsController.createSection
)

router.get('/:courseId/sections',
    SectionsController.getSectionsByCourse

)

router.get('/:courseId/sections/:sectionId',
    param('sectionId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    SectionsController.getSectionById
)

router.put('/:courseId/sections/:sectionId',
    param('sectionId').isMongoId().withMessage('ID no valido'),
    body('title')
        .notEmpty().withMessage('El nombre de la sección es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion de la sección es obligatoria'),

    handleInputErrors,
    SectionsController.updateSection
)

router.delete('/:courseId/sections/:sectionId',
    param('sectionId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    SectionsController.deleteSection
)

/**Routes for leassons */

router.post('/:courseId/sections/:sectionId/lessons',
    param('sectionId').isMongoId().withMessage('ID no valido'),
    body('title')
        .notEmpty().withMessage('El nombre de la sección es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion de la sección es obligatoria'),
    body('videoUrl')
        .optional()
        .isURL().withMessage('La URL del video no es válida'),
    body('fileUrl')
        .optional()
        .isURL().withMessage('La URL del archivo no es válida'),

    handleInputErrors,
    LeassonController.createLesson
)


export default router;