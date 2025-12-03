import mongoose from "mongoose";
import colors from "colors";
import { exit } from 'node:process';


export const conenctDB = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.DATABASE_URL)
        const url = `${connection.host}:${connection.port}`
        console.log(colors.magenta.bold(`MongoDB conectado en el host: ${url}✅`))
    } catch (error) {
        // console.log(error.message)
        console.log(colors.red.bold('Error al conectar a MongoDB'))
        exit(1)
    }
}