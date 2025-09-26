import { json, Request, Response } from "express";
import Section from "../models/Sections";
import Course from "../models/Courses";



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
            const sections = await Section.find({ course: req.course.id });
            res.json(sections)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error al obtener las secciones' })
        }
    }

    static getSectionById = async (req: Request, res: Response) => {
        try {
            //descomentar si quiero traer las lecciones, cuando las tega xD 
            // const sections = await (await Section.findById(req.params.sectionId)).populated('lessons');
            const section = await (await Section.findById(req.params.sectionId));
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
            req.course.sections = req.course.sections.filter(section => section.toString() !== req.section.id.toString())
            await Promise.allSettled([req.section.deleteOne(), req.course.save()])

            res.send('Sección eliminada con éxito');
        } catch (error) {

        }
    }
}
