import { Request, Response } from 'express';
import { CloudinaryService } from '../services/CloudinaryService';

export class FileController {
    
    /**
     * Elimina un archivo individual de Cloudinary
     */
    static deleteFile = async (req: Request, res: Response) => {
        try {
            const { url } = req.body;

            if (!url) {
                return res.status(400).json({
                    error: 'URL del archivo es requerida'
                });
            }

            const result = await CloudinaryService.deleteFile(url);

            if (result.success) {
                res.json({
                    message: result.message,
                    publicId: result.publicId
                });
            } else {
                res.status(400).json({
                    error: result.message
                });
            }

        } catch (error) {
            console.error('Error in deleteFile controller:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    };

    /**
     * Elimina múltiples archivos de Cloudinary
     */
    static deleteMultipleFiles = async (req: Request, res: Response) => {
        try {
            const { urls } = req.body;

            if (!urls || !Array.isArray(urls) || urls.length === 0) {
                return res.status(400).json({
                    error: 'Se requiere un array de URLs'
                });
            }

            const result = await CloudinaryService.deleteMultipleFiles(urls);

            res.json({
                message: 'Proceso de eliminación completado',
                result
            });

        } catch (error) {
            console.error('Error in deleteMultipleFiles controller:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    };

    /**
     * Elimina un archivo específico de una lección y actualiza la base de datos
     */
    static deleteFileFromLesson = async (req: Request, res: Response) => {
        try {
            const { url, fileType } = req.body; // fileType: 'video' | 'image' | 'file'

            if (!url || !fileType) {
                return res.status(400).json({
                    error: 'URL y tipo de archivo son requeridos'
                });
            }

            // Eliminar de Cloudinary
            const cloudinaryResult = await CloudinaryService.deleteFile(url);

            if (!cloudinaryResult.success) {
                return res.status(400).json({
                    error: cloudinaryResult.message
                });
            }

            // Actualizar la lección en la base de datos
            const lesson = req.lesson;
            
            switch (fileType) {
                case 'video':
                    lesson.videoUrl = lesson.videoUrl?.filter(videoUrl => videoUrl !== url) || [];
                    break;
                case 'image':
                    lesson.imageUrl = lesson.imageUrl?.filter(imageUrl => imageUrl !== url) || [];
                    break;
                case 'file':
                    lesson.fileUrl = lesson.fileUrl?.filter(fileUrl => fileUrl !== url) || [];
                    break;
                default:
                    return res.status(400).json({
                        error: 'Tipo de archivo no válido'
                    });
            }

            await lesson.save();

            res.json({
                message: 'Archivo eliminado exitosamente de Cloudinary y la lección',
                cloudinaryResult
            });

        } catch (error) {
            console.error('Error in deleteFileFromLesson controller:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    };
}