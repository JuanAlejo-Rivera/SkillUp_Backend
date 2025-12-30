import express, { Router } from "express";
import { body, param } from "express-validator";
import { CouseController } from "../controllers/CousesController";
import { handleInputErrors } from "../middleware/validation";
import { SectionsController } from "../controllers/SectionsController";
import { hasAutorization, validateCourseExists } from "../middleware/courses";
import { sectionBelongsToCourse, validateSectionExists } from "../middleware/section";
import { LeassonController } from "../controllers/LessonController";
import { validateLessonExists } from "../middleware/lesson";
import { authenticate } from "../middleware/auth";

const router = Router()


/** Routes for courses */

// Endpoint temporal para debug (SIN autenticación para prueba rápida)
router.get('/debug/lesson-urls', CouseController.debugLesson)

router.use(authenticate)// todas las rutas de este router pasaran por este middleware, para estar protegidas

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

router.param('courseId', validateCourseExists)

router.put('/:courseId',
    hasAutorization,
    param('courseId').isMongoId().withMessage('ID no valido'),

    body('courseName')
        .notEmpty().withMessage('El nombre del curso es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion del curso es obligatoria'),
    body('department')
        .notEmpty().withMessage('El departamento del curso es obligatorio'),


    handleInputErrors,
    CouseController.updateCourse
)
router.delete('/:courseId',
    hasAutorization,
    param('courseId').isMongoId().withMessage('ID no valido'),

    handleInputErrors,
    CouseController.deleteCourse
)


/**Routes for sections */


router.param('sectionId', validateSectionExists)

router.post('/:courseId/sections',
    hasAutorization,
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
    hasAutorization,
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
//para actualizar el orden de las secciones
router.patch('/:courseId/sections/order',
    hasAutorization,
    body('sections').isArray().withMessage('Sections debe ser un array'),
    handleInputErrors,
    SectionsController.updateSectionsOrder
)

/**Routes for leassons */
router.param('sectionId', sectionBelongsToCourse)
router.param('lessonId', validateLessonExists)

router.post('/:courseId/sections/:sectionId/lessons',
    param('sectionId')
        .isMongoId()
        .withMessage('ID no válido'),

    body('title')
        .notEmpty()
        .withMessage('El nombre de la sección es obligatorio'),

    body('description')
        .notEmpty()
        .withMessage('La descripción de la sección es obligatoria'),

    body('videoUrl')
        .optional({ checkFalsy: true })
        .matches(
            /^https?:\/\/[^\s]+\/[^\s]+\.(mp4|mov|avi|mkv|webm|flv)(?:\?.*)?$/i
        )
        .withMessage('La URL del video debe ser válida (.mp4, .mov, .avi, .mkv, .webm o .flv).'),

    body('fileUrl')
        .optional({ checkFalsy: true })
        .matches(
            /^https?:\/\/[^\s]+\/[^\s]+\.(pdf|docx?|pptx?|xlsx?)(?:\?.*)?$/i
        )
        .withMessage('La URL del archivo debe ser válida (.pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx).'),

    body('imageUrl')
        .optional({ checkFalsy: true })
        .matches(
            /^https?:\/\/[^\s]+\/[^\s]+\.(jpg|jpeg|png|gif|webp)(?:\?.*)?$/i
        )
        .withMessage('La URL de la imagen debe ser válida (.jpg, .jpeg, .png, .gif o .webp).'),

    handleInputErrors,
    LeassonController.createLesson
)

router.get('/:courseId/sections/:sectionId/lessons',
    handleInputErrors,
    LeassonController.getLessonsBySection
)

router.get('/:courseId/sections/:sectionId/lessons/:lessonId',
    param('lessonId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    LeassonController.getLessonById
)

router.put('/:courseId/sections/:sectionId/lessons/:lessonId',
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
    body('imageUrl')
        .optional()
        .isURL().withMessage('La URL de la imagen no es válida'),

    handleInputErrors,
    LeassonController.updateLesson

)

router.delete('/:courseId/sections/:sectionId/lessons/:lessonId',
    param('lessonId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    LeassonController.deleteLesson
)
//para actualizar el orden de las lecciones
router.patch('/:courseId/sections/:sectionId/lessons/order',
    hasAutorization,
    body('lessons').isArray().withMessage('Lessons debe ser un array'),
    handleInputErrors,
    LeassonController.updateLessonsOrder
)

export default router;