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
            const error = new Error('Curso no encontrado')
            res.status(404).json({ error: error.message })
            return
        }
        req.course = course
        next()

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })

    }
}

export function hasAutorization(req: Request, res: Response, next: NextFunction) {
    // Admin puede realizar cualquier acción, otros solo en sus propios cursos
    if (req.user.role === 'admin' || req.user.id.toString() === req.course.manager.toString()) {
        next()
    } else {
        const error = new Error('No tienes permisos para realizar esta acción')
        res.status(403).json({ error: error.message })
        return
    }
}