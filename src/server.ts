import  express  from 'express';
import dontenv from "dotenv";
import cors from 'cors';
import { corsConfig } from "./config/cors";
import { conenctDB } from './config/db';
import cousesRoutes from './routes/coursesRoutes';



dontenv.config();
conenctDB();

const app = express();
app.use(cors(corsConfig));

app.use(express.json());

//Routes
app.use('/api/courses', cousesRoutes)

export default app;