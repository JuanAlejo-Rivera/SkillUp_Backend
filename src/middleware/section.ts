import type { Request, Response, NextFunction } from "express";
import Section, { ISection } from "../models/Sections";

declare global {
    namespace Express {
        interface Request {
            section: ISection
        }
    }
}


export async function validateSectionExists(req: Request, res: Response, next: NextFunction) {
    try {

        const { sectionId } = req.params
        const section = await Section.findById(sectionId)

            if(!section) {
                 res.status(404).json({ error: 'Sección no encontrada' });
                 return
            }


        req.section = section
        next()

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })

    }
}