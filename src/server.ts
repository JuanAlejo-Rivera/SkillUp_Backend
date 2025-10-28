import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsConfig } from "./config/cors";
import { conenctDB } from "./config/db";
import coursesRoutes from "./routes/coursesRoutes";
import departmentsRoutes from "./routes/departmentsRoutes";

dotenv.config();
conenctDB();

const app = express();

app.use(cors(corsConfig));
app.use(express.json());

// Rutas
app.use("/api/courses", coursesRoutes);
app.use("/api/departments", departmentsRoutes);

export default app;
