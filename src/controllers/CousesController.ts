import type { Request, Response } from "express";
import Course from "../models/Courses";


export class CouseController {

    static createCourse = async (req: Request, res: Response) => {

        const course = new Course(req.body)

        //asignar el manager del curso
        course.manager = req.user.id

        try {
            await course.save()
            res.send('Curso creado con éxito')
        } catch (error) {
            console.log(error)
        }

    }

    static getAllCourses = async (req: Request, res: Response) => {
        try {
            const courses = await Course.find({})
                .populate('department')
                .populate('manager', 'name email')
                .populate('lastEditedBy', 'name email');
            // const courses = await Course.find({
            //     $or: [
            //         { manager: { $in: req.user.id } },// trae solo los cursos que el usuario creo
            //     ]

            // }).populate('department');
            res.json(courses)
        } catch (error) {
            console.log(error)
        }
    }

    static getCourseById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const course = await Course.findById(id)
                .populate('department')
                .populate('manager', 'name email')
                .populate('lastEditedBy', 'name email');

            if (!course) {
                const error = new Error('Curso no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            res.json(course)
        } catch (error) {
            console.log(error)
        }
    }

    static updateCourse = async (req: Request, res: Response) => {
        const { courseId } = req.params
        try {
            req.body.lastEditedBy = req.user.id
            const course = await Course.findById(courseId)


            if (!course) {
                const error = new Error('Curso no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            // Admin puede editar cualquier curso, otros solo sus propios cursos
            if (req.user.role !== 'admin' && req.course.manager.toString() !== req.user.id.toString()) {
                const error = new Error('No tienes permisos para actualizar este curso')
                res.status(403).json({ error: error.message })
                return
            }
            req.course.courseName = req.body.courseName
            req.course.description = req.body.description
            req.course.department = req.body.department
            req.course.lastEditedBy = req.user.id

            await req.course.save()
            res.send('Curso actualizado con éxito')

        } catch (error) {
            console.log(error)
        }
    }

    static deleteCourse = async (req: Request, res: Response) => {
        try {
            // Admin puede eliminar cualquier curso, otros solo sus propios cursos
            if (req.user.role !== 'admin' && req.course.manager.toString() !== req.user.id.toString()) {
                const error = new Error('No tienes permisos para eliminar este curso')
                res.status(403).json({ error: error.message })
                return
            }

            await req.course.deleteOne()
            res.send('Curso eliminado con éxito')
        } catch (error) {
            console.log(error)
        }
    }


}