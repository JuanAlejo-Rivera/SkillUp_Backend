import type { Request, Response } from "express";


export class CouseController {

    static createCourse = async (req: Request, res: Response) => {
        console.log(req.body)
        res.send('Creando Proyecto...')
    }

    static getAllCourses = async (req: Request, res: Response) => {
        res.send('Todos los proyectos')
    }


}