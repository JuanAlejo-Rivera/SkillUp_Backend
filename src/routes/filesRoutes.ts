import { Router } from 'express';
import { body, param } from 'express-validator';
import { FileController } from '../controllers/FileController';
import { handleInputErrors } from '../middleware/validation';
import { validateLessonExists } from '../middleware/lesson';

const router = Router();

console.log('✅ filesRoutes.ts loaded and initialized');

// TEST ROUTE - to verify routes are loading
router.get('/test', (req, res) => {
    console.log('🧪 Test route hit!');
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

// Eliminar archivo específico de una lección
router.delete('/lesson/:sectionId/:lessonId/file',
    (req, res, next) => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎯 DELETE ROUTE HIT!');
        console.log('Full URL:', req.url);
        console.log('Method:', req.method);
        console.log('Params:', req.params);
        console.log('Body:', req.body);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        next();
    },
    param('sectionId')
        .isMongoId()
        .withMessage('ID de sección no válido'),
    param('lessonId')
        .isMongoId()
        .withMessage('ID de lección no válido'),
    body('url')
        .notEmpty()
        .withMessage('URL del archivo es requerida')
        .isURL()
        .withMessage('URL no válida'),
    body('fileType')
        .isIn(['video', 'image', 'file'])
        .withMessage('Tipo de archivo debe ser: video, image o file'),
    (req, res, next) => {
        console.log('⚡ Passed validation, moving to handleInputErrors');
        next();
    },
    handleInputErrors,
    (req, res, next) => {
        console.log('⚡ Passed handleInputErrors, moving to validateLessonExists');
        next();
    },
    validateLessonExists,
    (req, res, next) => {
        console.log('⚡ Passed validateLessonExists, moving to controller');
        next();
    },
    FileController.deleteFileFromLesson
);

console.log('✅ DELETE /lesson/:sectionId/:lessonId/file route registered');

export default router;
