import  express  from 'express';
import dontenv from "dotenv";
import { conenctDB } from './config/db';
import cousesRoutes from './routes/coursesRoutes';



dontenv.config();
conenctDB();

const app = express();

app.use(express.json());

//Routes
app.use('/api/courses', cousesRoutes)

export default app;