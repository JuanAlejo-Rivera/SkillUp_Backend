import { json, Request, Response } from "express";
import Lesson from "../models/Lesson";
import { CloudinaryService } from "../services/CloudinaryService";



export class LeassonController {

    //Crear lesson y asociar a section
    static createLesson = async (req: Request, res: Response) => {

        try {
            const { title, description, videoUrl = [], fileUrl = [], imageUrl = [] } = req.body;

            const lesson = new Lesson({
                title,
                description,
                videoUrl,
                fileUrl,
                imageUrl,
                section: req.params.sectionId
            })

            req.section.lessons.push(lesson.id)
            await Promise.allSettled([lesson.save(), req.section.save()])

            res.send('Lección creada con éxito')



        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al crear la lección' })
        }
    }

    static getLessonsBySection = async (req: Request, res: Response) => {
        try {
            const lessons = await Lesson.find({ section: req.params.sectionId })
            res.json(lessons)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al obtener las lecciones' })
        }

    }

    static getLessonById = async (req: Request, res: Response) => {
        try {
            res.json(req.lesson)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al obtener la lección' })

        }
    }

    static updateLesson = async (req: Request, res: Response) => {
        try {
            const { title, description, videoUrl, fileUrl, imageUrl } = req.body;

            req.lesson!.title = title;
            req.lesson!.description = description ;

            if (videoUrl?.length) {
                req.lesson!.videoUrl = Array.from(new Set([
                    ...(req.lesson!.videoUrl || []),
                    ...videoUrl
                ]));
            }

            if (fileUrl?.length) {
                req.lesson!.fileUrl = Array.from(new Set([
                    ...(req.lesson!.fileUrl || []),
                    ...fileUrl
                ]));
            }

            if (imageUrl?.length) {
                req.lesson!.imageUrl = Array.from(new Set([
                    ...(req.lesson!.imageUrl || []),
                    ...imageUrl
                ]));
            }

            await req.lesson!.save();
            res.send('Lección actualizada con éxito');
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error al actualizar la lección' });
        }
    };


    static deleteLesson = async (req: Request, res: Response) => {
        try {
            const lesson = req.lesson;
            
            // Eliminar todos los archivos asociados de Cloudinary
            const cloudinaryResult = await CloudinaryService.deleteLessonFiles(
                lesson.videoUrl || [],
                lesson.imageUrl || [],
                lesson.fileUrl || []
            );

            // Log de archivos eliminados (opcional)
            if (cloudinaryResult.failed.length > 0) {
                console.warn('Algunos archivos no pudieron ser eliminados de Cloudinary:', cloudinaryResult.failed);
            }

            // Eliminar la lección de la sección
            req.section.lessons = req.section.lessons.filter(lesson => lesson.toString() !== req.lesson.id.toString())

            // Eliminar la lección de la base de datos y actualizar la sección
            await Promise.allSettled([req.lesson!.deleteOne(), req.section.save()])
            
            res.json({ 
                message: 'Lección eliminada con éxito',
                cloudinaryResult: {
                    totalFiles: cloudinaryResult.summary.total,
                    filesDeleted: cloudinaryResult.summary.successful,
                    filesFailed: cloudinaryResult.summary.failed
                }
            })

        } catch (error) {
            console.error('Error deleting lesson:', error);
            res.status(500).json({ error: 'Hubo un error al eliminar la lección' })
        }
    }
}