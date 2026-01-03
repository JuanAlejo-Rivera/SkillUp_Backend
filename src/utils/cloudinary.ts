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
    // La URL es la fuente de verdad - verificar PRIMERO dónde está almacenado
    if (url.includes('/video/upload/')) return 'video';
    if (url.includes('/raw/upload/')) return 'raw';
    if (url.includes('/image/upload/')) return 'image';  // ← Confiar en la URL
    
    // Si no hay indicador en la URL, usar la extensión
    const extension = url.split('.').pop()?.toLowerCase().split('?')[0];
    
    if (['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm', 'm4v', 'mpeg', 'mpg'].includes(extension || '')) {
        return 'video';
    }
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff'].includes(extension || '')) {
        return 'image';
    }
    
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'zip', 'rar'].includes(extension || '')) {
        return 'raw';
    }
    
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
        
        // Determinar si debe incluir extensión:
        // - Para raw: siempre incluir extensión
        // - Para image con extensión de documento (.pdf, .doc): incluir extensión
        const extension = url.split('.').pop()?.toLowerCase().split('?')[0];
        const isDocument = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'].includes(extension || '');
        const includeExtension = (resourceType === 'raw') || (resourceType === 'image' && isDocument);
        
        const publicId = extractPublicId(url, includeExtension);
        
        if (!publicId) {
            console.warn(`No se pudo extraer public_id de la URL: ${url}`);
            return false;
        }
        
        console.log(`Intentando eliminar de Cloudinary:`);
        console.log(`- Public ID: ${publicId}`);
        console.log(`- Resource Type: ${resourceType}`);
        
        let result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true
        });
        
        console.log(`Respuesta de Cloudinary:`, result);
        
        // Si no se encuentra, intentar sin la extensión
        if (result.result === 'not found' && publicId.includes('.')) {
            const publicIdWithoutExt = publicId.substring(0, publicId.lastIndexOf('.'));
            console.log(`⚠️ Reintentando sin extensión: ${publicIdWithoutExt}`);
            
            result = await cloudinary.uploader.destroy(publicIdWithoutExt, {
                resource_type: resourceType,
                invalidate: true
            });
            
            console.log(`Resultado:`, result);
        }
        
        if (result.result === 'ok') {
            console.log(`✅ Asset eliminado exitosamente`);
            return true;
        } else if (result.result === 'not found') {
            console.log(`Asset no encontrado en Cloudinary (puede que ya fue eliminado)`);
            return true;
        } else {
            console.warn(`❌ Error al eliminar:`, result);
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
