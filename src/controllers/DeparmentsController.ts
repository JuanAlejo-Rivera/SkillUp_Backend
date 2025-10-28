import Deparment from "../models/Departments"
import { Request, Response } from "express";

export class DeparmentsController {

    static createDepartment = async (req: Request, res: Response) => {

        const department = new Deparment(req.body)

        try {
            await department.save()
            res.send('Departamento creado con éxito')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al crear el departamento' })
        }

    }

    static getDepartments = async (req: Request, res: Response) => {
        try {
            const departments = await Deparment.find({})
            res.json(departments)
            
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al obtener los departamentos' })
        }
    }

}