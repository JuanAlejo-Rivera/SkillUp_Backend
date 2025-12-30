import { extractPublicId, getResourceType } from "./cloudinary";

/**
 * Script de prueba para verificar la extracción de public_id
 */

// Ejemplos de URLs de Cloudinary
const testUrls = [
    "https://res.cloudinary.com/dwsd4k9eu/image/upload/v1234567890/folder/image.jpg",
    "https://res.cloudinary.com/dwsd4k9eu/video/upload/v1234567890/video.mp4",
    "https://res.cloudinary.com/dwsd4k9eu/raw/upload/v1234567890/document.pdf",
    "https://res.cloudinary.com/dwsd4k9eu/image/upload/image.jpg",
    "https://res.cloudinary.com/dwsd4k9eu/video/upload/folder/subfolder/video.mp4",
];

console.log("=== PRUEBA DE EXTRACCIÓN DE PUBLIC_ID ===\n");

testUrls.forEach((url, index) => {
    console.log(`Test ${index + 1}:`);
    console.log(`URL: ${url}`);
    console.log(`Public ID: ${extractPublicId(url)}`);
    console.log(`Resource Type: ${getResourceType(url)}`);
    console.log("---");
});

export const testCloudinaryExtraction = () => {
    console.log("\n=== Función de prueba ejecutada ===");
    testUrls.forEach(url => {
        const publicId = extractPublicId(url);
        const resourceType = getResourceType(url);
        console.log(`${url} -> ${publicId} (${resourceType})`);
    });
};
