import { Router } from 'express';
import { body, param } from 'express-validator';
import { FileController } from '../controllers/FileController';
import { handleInputErrors } from '../middleware/validation';
import { validateLessonExists } from '../middleware/lesson';

const router = Router();

// Eliminar un archivo individual
router.delete('/delete',
    body('url')
        .notEmpty()
        .withMessage('URL del archivo es requerida')
        .isURL()
        .withMessage('URL no válida'),
    handleInputErrors,
    FileController.deleteFile
);

// Eliminar múltiples archivos
router.delete('/delete-multiple',
    body('urls')
        .isArray({ min: 1 })
        .withMessage('Se requiere un array de URLs con al menos un elemento'),
    body('urls.*')
        .isURL()
        .withMessage('Todas las URLs deben ser válidas'),
    handleInputErrors,
    FileController.deleteMultipleFiles
);

// Eliminar archivo específico de una lección
router.delete('/lesson/:lessonId/file',
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
    handleInputErrors,
    validateLessonExists,
    FileController.deleteFileFromLesson
);

export default router;