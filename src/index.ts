// IMPORTANTE: Cargar variables de entorno ANTES que cualquier otra cosa
import dotenv from "dotenv";
dotenv.config();

import server from "./server";
import colors from "colors";


const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log(colors.cyan.bold(`Rest API funcionando en el puerto ${port}✅`))
})