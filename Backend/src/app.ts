import dal from "./2-utils/dal";
dal.connect();

import express from "express";
import cors from "cors";
import catchAll from "./3-middleware/catch-all";
import routeNotFound from "./3-middleware/route-not-found";
import authController from "./6-controllers/authController";
import cartController from "./6-controllers/cartController";
import productController from "./6-controllers/productController";
import config from "./2-utils/config";

const server = express();

server.use(cors());
server.use(express.json());
server.use("/api", authController);
server.use("/api", cartController);
server.use("/api", productController);
server.use("*", routeNotFound);
server.use(catchAll);

server.listen(config.port, () =>
  console.log("Listening on http://localhost:" + config.port)
);
