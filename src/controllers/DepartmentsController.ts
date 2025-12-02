import Department from "../models/Departments"
import Courses from "../models/Courses"
import { Request, Response } from "express";

export class DepartmentsController {

    static createDepartment = async (req: Request, res: Response) => {

        const department = new Department(req.body)

        try {
            await department.save()
            res.send('Departamento creado con éxito')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al crear el departamento' })
        }

    }

    static getDepartments = async (req: Request, res: Response) => {
        try {
            const departments = await Department.find({})
            res.json(departments)

        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al obtener los departamentos' })
        }
    }

    static deleteDepartment = async (req: Request, res: Response) => {
        try {
            const { departmentId } = req.params
            const department = await Department.findById(departmentId)

            if (!department) {
                return res.status(404).json({ error: 'Departamento no encontrado' })
            }

            // Verificar si el departamento está siendo usado por algún curso
            const coursesUsingDepartment = await Courses.countDocuments({ department: departmentId })

            if (coursesUsingDepartment > 0) {
                return res.status(400).json({ 
                    error: `No se puede eliminar el departamento porque está siendo usado por ${coursesUsingDepartment} curso(s)` 
                })
            }

            await department.deleteOne()

            res.send('Departamento eliminado con éxito')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al eliminar el departamento' })
        }
    }
}