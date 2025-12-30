import Lesson from "../models/Lesson";
import Section from "../models/Sections";
import Course from "../models/Courses";
import { deleteMultipleCloudinaryAssets } from "./cloudinary";

/**
 * Elimina todos los assets de Cloudinary asociados a una lección
 * @param lessonId - ID de la lección
 * @returns Promise con el número de assets eliminados
 */
export const deleteLessonAssets = async (lessonId: string): Promise<number> => {
    try {
        console.log(`\nIniciando eliminación de assets para lección: ${lessonId}`);
        
        const lesson = await Lesson.findById(lessonId);
        
        if (!lesson) {
            console.warn(`Lección no encontrada: ${lessonId}`);
            return 0;
        }

        // Recopilar todas las URLs de la lección
        const allUrls: string[] = [
            ...(lesson.videoUrl || []),
            ...(lesson.fileUrl || []),
            ...(lesson.imageUrl || [])
        ];

        console.log(`URLs encontradas en la lección "${lesson.title}":`);
        console.log(`- Videos: ${lesson.videoUrl?.length || 0}`);
        console.log(`- Archivos: ${lesson.fileUrl?.length || 0}`);
        console.log(`- Imágenes: ${lesson.imageUrl?.length || 0}`);
        console.log(`- Total: ${allUrls.length}`);

        if (allUrls.length === 0) {
            console.log(`La lección ${lessonId} no tiene assets para eliminar`);
            return 0;
        }

        console.log(`\nEliminando ${allUrls.length} assets de la lección "${lesson.title}"`);
        
        const deletedCount = await deleteMultipleCloudinaryAssets(allUrls);
        
        console.log(`\nResultado: ${deletedCount}/${allUrls.length} assets eliminados de Cloudinary\n`);
        
        return deletedCount;
        
    } catch (error) {
        console.error(`Error al eliminar assets de la lección ${lessonId}:`, error);
        return 0;
    }
};

/**
 * Elimina todos los assets de Cloudinary de todas las lecciones de una sección
 * @param sectionId - ID de la sección
 * @returns Promise con el número de assets eliminados
 */
export const deleteSectionAssets = async (sectionId: string): Promise<number> => {
    try {
        const section = await Section.findById(sectionId);
        
        if (!section) {
            console.warn(`Sección no encontrada: ${sectionId}`);
            return 0;
        }

        // Obtener todas las lecciones de la sección
        const lessons = await Lesson.find({ section: sectionId });
        
        if (lessons.length === 0) {
            console.log(`La sección ${sectionId} no tiene lecciones con assets`);
            return 0;
        }

        console.log(`Eliminando assets de ${lessons.length} lecciones de la sección ${section.title}`);
        
        let totalDeleted = 0;
        
        // Eliminar assets de cada lección
        for (const lesson of lessons) {
            const deleted = await deleteLessonAssets(lesson._id.toString());
            totalDeleted += deleted;
        }
        
        console.log(`Total de assets eliminados de la sección: ${totalDeleted}`);
        
        return totalDeleted;
        
    } catch (error) {
        console.error(`Error al eliminar assets de la sección ${sectionId}:`, error);
        return 0;
    }
};

/**
 * Elimina todos los assets de Cloudinary de todas las secciones y lecciones de un curso
 * @param courseId - ID del curso
 * @returns Promise con el número de assets eliminados
 */
export const deleteCourseAssets = async (courseId: string): Promise<number> => {
    try {
        const course = await Course.findById(courseId);
        
        if (!course) {
            console.warn(`Curso no encontrado: ${courseId}`);
            return 0;
        }

        // Obtener todas las secciones del curso
        const sections = await Section.find({ course: courseId });
        
        if (sections.length === 0) {
            console.log(`El curso ${courseId} no tiene secciones con assets`);
            return 0;
        }

        console.log(`Eliminando assets de ${sections.length} secciones del curso ${course.courseName}`);
        
        let totalDeleted = 0;
        
        // Eliminar assets de cada sección (y sus lecciones)
        for (const section of sections) {
            const deleted = await deleteSectionAssets(section._id.toString());
            totalDeleted += deleted;
        }
        
        console.log(`Total de assets eliminados del curso: ${totalDeleted}`);
        
        return totalDeleted;
        
    } catch (error) {
        console.error(`Error al eliminar assets del curso ${courseId}:`, error);
        return 0;
    }
};
