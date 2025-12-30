import { json, Request, Response } from "express";
import Section from "../models/Sections";
import Course from "../models/Courses";
import { deleteSectionAssets } from "../utils/deleteAssets";



export class SectionsController {

    static createSection = async (req: Request, res: Response) => {
        //realizo la validacion desde el middleware y desestructuro el id en el mismo donde tambien reescribo el req
        try {
            const section = new Section(req.body)
            section.course = req.course.id
            req.course.sections.push(section.id)
            await section.save()
            await req.course.save()
            res.send('Sección creada con éxito')

        } catch (error) {
            console.log(error)
        }
    }

    static getSectionsByCourse = async (req: Request, res: Response) => {
        try {
            const sections = await Section.find({ course: req.course.id }).populate('lessons').sort({ order: 1 });
            res.json(sections)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error al obtener las secciones' })
        }
    }

    static getSectionById = async (req: Request, res: Response) => {
        try {
            const section = await Section.findById(req.params.sectionId).populate('lessons');
            res.json(section)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al obtener la sección' })
        }
    }

    static updateSection = async (req: Request, res: Response) => {
        try {

            const { title, description } = req.body;

            req.section.title = title;
            req.section.description = description;
            await req.section.save();

            res.send('Sección actualizada con éxito');

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al actualizar la sección' })
        }
    }

    static deleteSection = async (req: Request, res: Response) => {
        try {
            // Admin y profesores pueden eliminar secciones, pero otros usuarios no
            if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
                const error = new Error('No tienes permisos para eliminar esta sección')
                res.status(403).json({ error: error.message })
                return
            }

            // Si no es admin, verificar que sea el creador del curso
            if (req.user.role !== 'admin' && req.course.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Solo el creador del curso puede eliminar secciones')
                res.status(403).json({ error: error.message })
                return
            }

            // Primero eliminar los assets de Cloudinary de todas las lecciones de la sección
            await deleteSectionAssets(req.section.id.toString());

            // Luego eliminar la sección de la base de datos
            req.course.sections = req.course.sections.filter(section => section.toString() !== req.section.id.toString())
            await Promise.allSettled([req.section.deleteOne(), req.course.save()])

            res.send('Sección eliminada con éxito');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al eliminar la sección' })
        }
    }

    static updateSectionsOrder = async (req: Request, res: Response) => {
        try {
            const { sections } = req.body; // Array de { id: string, order: number }
            
            // Actualizar el orden de cada sección
            await Promise.all(
                sections.map(async (item: { id: string; order: number }) => {
                    await Section.findByIdAndUpdate(item.id, { order: item.order });
                })
            );

            res.send('Orden de secciones actualizado con éxito');
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al actualizar el orden de las secciones' });
        }
    }

}
