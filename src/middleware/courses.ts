import type { Request, Response, NextFunction } from "express";
import Course, { Icourse } from "../models/Courses";

declare global {
    namespace Express {
        interface Request {
            course: Icourse
        }
    }
}


export async function validateCourseExists(req: Request, res: Response, next: NextFunction) {
    try {

        const { courseId } = req.params
        const course = await Course.findById(courseId)

        if (!course) {
            const error = new Error('Proyecto no encontrado')
            res.status(404).json({ error: error.message })
            return
        }
        req.course = course
        next()

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })

    }
}