import cloudinary from "../config/cloudinary";

// Asegurar que cloudinary esté configurado antes de usar
const ensureCloudinaryConfig = () => {
    const config = cloudinary.config();
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
        throw new Error('Cloudinary no está configurado correctamente. Verifica las variables de entorno.');
    }
};

/**
 * Extrae el public_id de una URL de Cloudinary
 * @param url - URL completa de Cloudinary
 * @param includeExtension - Si es true, mantiene la extensión del archivo
 * @returns public_id extraído de la URL (decodificado)
 */
export const extractPublicId = (url: string, includeExtension: boolean = false): string | null => {
    try {
        // Formato típico: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{format}
        const urlParts = url.split('/upload/');
        if (urlParts.length < 2) return null;
        
        const afterUpload = urlParts[1];
        // Remover la versión (v123456789/) si existe
        const withoutVersion = afterUpload.replace(/^v\d+\//, '');
        
        let publicId: string;
        
        if (includeExtension) {
            // Para archivos raw, mantener la extensión
            publicId = decodeURIComponent(withoutVersion);
        } else {
            // Para imágenes y videos, remover la extensión
            const publicIdEncoded = withoutVersion.substring(0, withoutVersion.lastIndexOf('.'));
            publicId = decodeURIComponent(publicIdEncoded);
        }
        
        return publicId;
    } catch (error) {
        console.error('Error al extraer public_id:', error);
        return null;
    }
};

/**
 * Determina el resource_type basado en la URL y extensión del archivo
 * @param url - URL de Cloudinary
 * @returns 'image', 'video' o 'raw'
 */
export const getResourceType = (url: string): 'image' | 'video' | 'raw' => {
    // Primero verificar por el tipo en la URL
    if (url.includes('/video/upload/')) return 'video';
    if (url.includes('/raw/upload/')) return 'raw';
    
    // Extraer la extensión del archivo
    const extension = url.split('.').pop()?.toLowerCase().split('?')[0]; // Remover query params si existen
    
    // Extensiones de documento siempre son 'raw', incluso si están en /image/upload/
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'zip', 'rar'].includes(extension || '')) {
        return 'raw';
    }
    
    // Extensiones de video
    if (['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm', 'm4v', 'mpeg', 'mpg'].includes(extension || '')) {
        return 'video';
    }
    
    // Extensiones de imagen
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff'].includes(extension || '')) {
        return 'image';
    }
    
    // Si la URL dice /image/upload/ y no coincide con documentos/videos, asumir image
    if (url.includes('/image/upload/')) return 'image';
    
    // Por defecto, raw para archivos desconocidos
    return 'raw';
};

/**
 * Elimina un asset de Cloudinary
 * @param url - URL del asset en Cloudinary
 * @returns Promise con el resultado - retornando un bool 
 */
export const deleteCloudinaryAsset = async (url: string): Promise<boolean> => {
    try {
        // Verificar configuración
        ensureCloudinaryConfig();
        
        console.log(`\nProcesando URL: ${url}`);
        
        const resourceType = getResourceType(url);
        
        // Para archivos raw, incluir la extensión en el public_id
        const includeExtension = (resourceType === 'raw');
        const publicId = extractPublicId(url, includeExtension);
        
        if (!publicId) {
            console.warn(`No se pudo extraer public_id de la URL: ${url}`);
            return false;
        }
        
        console.log(`Intentando eliminar de Cloudinary:`);
        console.log(`- Public ID: ${publicId}`);
        console.log(`- Resource Type: ${resourceType}`);
        
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true
        });
        
        console.log(`Respuesta de Cloudinary:`, result);
        
        if (result.result === 'ok' || result.result === 'not found') {
            console.log(`Asset eliminado exitosamente: ${publicId}`);
            return true;
        } else {
            console.warn(`Advertencia al eliminar ${publicId}:`, result);
            return false;
        }
        
    } catch (error) {
        console.error(`Error al eliminar asset de Cloudinary (${url}):`, error);
        return false;
    }
};

/**
 * Elimina múltiples assets de Cloudinary
 * @param urls - Array de URLs de Cloudinary
 * @returns Promise con el número de assets eliminados exitosamente - retornando el numero de eliminaciones exitosas
 */
export const deleteMultipleCloudinaryAssets = async (urls: string[]): Promise<number> => {
    if (!urls || urls.length === 0) {
        return 0;
    }

    let successCount = 0;
    
    // Procesar eliminaciones en paralelo con Promise.allSettled para continuar aunque falle alguna
    const results = await Promise.allSettled(
        urls.map(url => deleteCloudinaryAsset(url))
    );
    
    results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
            successCount++;
        } else {
            console.error(`Error al eliminar asset ${index + 1}/${urls.length}`);
        }
    });
    
    console.log(`Eliminados ${successCount}/${urls.length} assets de Cloudinary`);
    
    return successCount;
};
