import cloudinary from '../config/cloudinary';
import { extractPublicIdFromUrl, getResourceType } from '../utils/cloudinaryUtils';

export class CloudinaryService {
    
    /**
     * Elimina un archivo individual de Cloudinary
     * @param url - URL del archivo a eliminar
     * @returns Promise con el resultado de la eliminación
     */
    static async deleteFile(url: string): Promise<{ success: boolean; message: string; publicId?: string }> {
        try {
            const publicId = extractPublicIdFromUrl(url);
            
            if (!publicId) {
                return {
                    success: false,
                    message: 'No se pudo extraer el public_id de la URL'
                };
            }

            const resourceType = getResourceType(url);
            
            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: resourceType
            });

            if (result.result === 'ok') {
                return {
                    success: true,
                    message: 'Archivo eliminado exitosamente',
                    publicId
                };
            } else {
                return {
                    success: false,
                    message: `Error al eliminar archivo: ${result.result}`
                };
            }

        } catch (error) {
            console.error('Error deleting file from Cloudinary:', error);
            return {
                success: false,
                message: 'Error interno al eliminar archivo'
            };
        }
    }

    /**
     * Elimina múltiples archivos de Cloudinary
     * @param urls - Array de URLs a eliminar
     * @returns Promise con los resultados de todas las eliminaciones
     */
    static async deleteMultipleFiles(urls: string[]): Promise<{
        successful: string[];
        failed: { url: string; error: string }[];
        summary: { total: number; successful: number; failed: number };
    }> {
        const successful: string[] = [];
        const failed: { url: string; error: string }[] = [];

        const deletePromises = urls.map(async (url) => {
            const result = await this.deleteFile(url);
            if (result.success) {
                successful.push(url);
            } else {
                failed.push({ url, error: result.message });
            }
        });

        await Promise.allSettled(deletePromises);

        return {
            successful,
            failed,
            summary: {
                total: urls.length,
                successful: successful.length,
                failed: failed.length
            }
        };
    }

    /**
     * Elimina todos los archivos asociados a una lección
     * @param videoUrls - URLs de videos
     * @param imageUrls - URLs de imágenes  
     * @param fileUrls - URLs de documentos
     * @returns Promise con el resultado de todas las eliminaciones
     */
    static async deleteLessonFiles(
        videoUrls: string[] = [],
        imageUrls: string[] = [],
        fileUrls: string[] = []
    ) {
        const allUrls = [...videoUrls, ...imageUrls, ...fileUrls];
        
        if (allUrls.length === 0) {
            return {
                successful: [],
                failed: [],
                summary: { total: 0, successful: 0, failed: 0 }
            };
        }

        return await this.deleteMultipleFiles(allUrls);
    }
}