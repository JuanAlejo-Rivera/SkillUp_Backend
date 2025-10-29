/**
 * Extrae el public_id de una URL de Cloudinary
 * @param url - URL de Cloudinary
 * @returns public_id extraído o null si no es una URL válida
 */
export function extractPublicIdFromUrl(url: string): string | null {
    try {
        // Patrón para URLs de Cloudinary
        const cloudinaryPattern = /cloudinary\.com\/[^\/]+\/(?:image|video|raw)\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/;
        const match = url.match(cloudinaryPattern);
        
        if (match && match[1]) {
            // Remueve parámetros de transformación si existen
            const publicId = match[1].split('/').pop()?.split('.')[0];
            return publicId || null;
        }
        
        return null;
    } catch (error) {
        console.error('Error extracting public_id from URL:', error);
        return null;
    }
}

/**
 * Determina el tipo de recurso basado en la URL
 * @param url - URL del archivo
 * @returns tipo de recurso para Cloudinary
 */
export function getResourceType(url: string): 'image' | 'video' | 'raw' {
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv'];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    const urlLower = url.toLowerCase();
    
    if (videoExtensions.some(ext => urlLower.includes(ext))) {
        return 'video';
    } else if (imageExtensions.some(ext => urlLower.includes(ext))) {
        return 'image';
    } else {
        return 'raw'; // Para documentos PDF, DOC, etc.
    }
}