import { v2 as cloudinary } from "cloudinary";

// Función para configurar Cloudinary (se ejecuta cuando se necesita, no al importar)
const configureCloudinary = () => {
    if (!cloudinary.config().cloud_name) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true
        });
        
        console.log('✅ Cloudinary configurado correctamente');
    }
    return cloudinary;
};

export default configureCloudinary();
