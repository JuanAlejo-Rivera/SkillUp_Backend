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

    // static getSectionsByCourse = async (req: Request, res: Response) => {
    //     const { courseId } = req.params
    //     try {
    //         const sections = await Section.find({ course: courseId }).populate('lessons')
    //         res.json(sections)
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json({ error: 'Hubo un error al obtener las secciones' })
    //     }
    // }

    // static getSectionById = async (req: Request, res: Response) => {
    //     const { sectionId } = req.params
    //     try {
    //         const section = await Section.findById(sectionId).populate('lessons')
    //         if (!section) {
    //             const error = new Error('Sección no encontrada')
    //             return res.status(404).json({ error: error.message })
    //         }
    //         res.json(section)
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json({ error: 'Hubo un error al obtener la sección' })
    //     }
    // }

    // static updateSection = async (req: Request, res: Response) => {
    //     const { sectionId } = req.params
    //     const { title, description 
}
