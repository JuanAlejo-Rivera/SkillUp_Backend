import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsConfig } from "./config/cors";
import { conenctDB } from "./config/db";
import coursesRoutes from "./routes/coursesRoutes";
import departmentsRoutes from "./routes/departmentsRoutes";
import filesRoutes from "./routes/filesRoutes";

dotenv.config();
conenctDB();

const app = express();

app.use(cors(corsConfig));
app.use(express.json());

// Rutas
app.use("/api/courses", coursesRoutes);
app.use("/api/departments", departmentsRoutes);
app.use("/api/files", filesRoutes);
app.use("/api/files", filesRoutes);

export default app;
