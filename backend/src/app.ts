import express from "express";
import cors from "cors";
import morgan from "morgan";


// Swagger
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { options } from "./swaggerOptions";

import loginRoutes from "./routes/login.routes";
import importacionRoutes from "./routes/importacion.routes";

require('dotenv').config();

const app = express();
console.log ('Estado: ', process.env.NODE_ENV)

app.set("port", process.env.PORT || 3500);

app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({limit: '50mb'}));


const specs = swaggerJsDoc(options);

// Routes
app.use(loginRoutes);
app.use("/importacion",importacionRoutes);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));

export default app;
