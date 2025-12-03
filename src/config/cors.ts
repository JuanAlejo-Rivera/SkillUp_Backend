import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const whitelist = [
            process.env.FRONTEND_URL, 
            process.env.FRONTEND_PROD_URL
        ];

        const isDevAPI = process.argv.includes("--api");

        if (isDevAPI) {
            // DESARROLLO → permitir Postman (origin === undefined)
            if (!origin || whitelist.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(new Error("No permitido por CORS"));
            }
        } else {
            // PRODUCCIÓN → bloquear Postman
            if (origin && whitelist.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(new Error("No permitido por CORS"));
            }
        }
    }
};
