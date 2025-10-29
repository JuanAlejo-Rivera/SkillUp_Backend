import { Router, type RequestHandler } from 'express';
import { body, param } from 'express-validator';
import { FileController } from '../controllers/FileController';
import { handleInputErrors } from '../middleware/validation';
import { validateLessonExists } from '../middleware/lesson';

const router = Router();

const ensureSectionContext: RequestHandler = (req, res, next) => {
    if (!req.params.sectionId) {
        const sectionFromBody = typeof req.body?.sectionId === 'string' ? req.body.sectionId.trim() : '';

        if (sectionFromBody) {
            req.params.sectionId = sectionFromBody;
        } else if (req.query?.sectionId) {
            if (Array.isArray(req.query.sectionId)) {
                req.params.sectionId = req.query.sectionId[0];
            } else if (typeof req.query.sectionId === 'string') {
                req.params.sectionId = req.query.sectionId;
            }
        }
    }

    if (!req.params.sectionId) {
        return res.status(400).json({ error: 'ID de seccion es requerido' });
    }

    next();
};

// TEST ROUTE - to verify routes are loading
router.get('/test', (req, res) => {
    res.json({ message: 'Files routes are working!' });
});

// Eliminar un archivo individual
router.delete('/delete',
    body('url')
        .notEmpty()
        .withMessage('URL del archivo es requerida')
        .isURL()
        .withMessage('URL no valida'),
    handleInputErrors,
    FileController.deleteFile
);

// Eliminar multiples archivos
router.delete('/delete-multiple',
    body('urls')
        .isArray({ min: 1 })
        .withMessage('Se requiere un array de URLs con al menos un elemento'),
    body('urls.*')
        .isURL()
        .withMessage('Todas las URLs deben ser validas'),
    handleInputErrors,
    FileController.deleteMultipleFiles
);

const lessonFileValidators = [
    body('url')
        .notEmpty()
        .withMessage('URL del archivo es requerida')
        .isURL()
        .withMessage('URL no valida'),
    body('fileType')
        .isIn(['video', 'image', 'file'])
        .withMessage('Tipo de archivo debe ser: video, image o file')
];

const logRoute: RequestHandler = (req, _res, next) => {
    console.log('dYZ_ Files route hit! Params:', req.params);
    console.log('Body:', req.body);
    next();
};

// Eliminar archivo especifico de una leccion (nueva ruta con sectionId en la URL)
router.delete('/lesson/:sectionId/:lessonId/file',
    logRoute,
    param('sectionId')
        .isMongoId()
        .withMessage('ID de seccion no valido'),
    param('lessonId')
        .isMongoId()
        .withMessage('ID de leccion no valido'),
    ...lessonFileValidators,
    handleInputErrors,
    ensureSectionContext,
    validateLessonExists,
    FileController.deleteFileFromLesson
);

// Ruta legacy sin sectionId en la URL
router.delete('/lesson/:lessonId/file',
    logRoute,
    param('lessonId')
        .isMongoId()
        .withMessage('ID de leccion no valido'),
    body('sectionId')
        .notEmpty()
        .withMessage('ID de seccion es requerido')
        .isMongoId()
        .withMessage('ID de seccion no valido'),
    ...lessonFileValidators,
    handleInputErrors,
    ensureSectionContext,
    validateLessonExists,
    FileController.deleteFileFromLesson
);

export default router;
