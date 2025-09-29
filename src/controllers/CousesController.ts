import type { Request, Response } from "express";
import Course from "../models/Courses";


export class CouseController {

    static createCourse = async (req: Request, res: Response) => {

        const course = new Course(req.body)

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
            res.json(courses)
        } catch (error) {
            console.log(error)
        }
    }

    static getCourseById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const course = await Course.findById(id)

            if (!course) {
                const error = new Error('Curso no encontrado')
                res.status(404).json({ error: error.message })
            }

            res.json(course)
        } catch (error) {
            console.log(error)
        }
    }

    static updateCourse = async (req: Request, res: Response) => {

        try {
            req.course.courseName = req.body.courseName
            req.course.description = req.body.description
            req.course.department = req.body.department

            await req.course.save()
            res.send('Curso actualizado con éxito')

        } catch (error) {
            console.log(error)
        }
    }

    static deleteCourse = async (req: Request, res: Response) => {
        try {

            await req.course.deleteOne()
            res.send('Curso eliminado con éxito')

        } catch (error) {
            console.log(error)
        }
    }


}