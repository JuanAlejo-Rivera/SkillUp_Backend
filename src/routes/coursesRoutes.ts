import  express, { Router }  from "express";
import { CouseController } from "../controllers/CousesController";

const router = Router()

router.post('/', CouseController.createCourse)
router.get('/', CouseController.getAllCourses)

export default router;