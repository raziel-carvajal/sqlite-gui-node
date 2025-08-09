import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import path from "path";
import databaseFunctions from "./Utils/databaseFunctions";
import logger from "./Utils/logger";
import tableRoutes from "./routes/tables";
import type { Database } from "sqlite3";
import { EXPRESS_APP_PATH } from './config/env-vars';

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.json());

// Routes
app.get(`${EXPRESS_APP_PATH}/query`, (req, res) => {
  res.render("query", { title: "Query Page", path: EXPRESS_APP_PATH });
});

app.get(`${EXPRESS_APP_PATH}/home`, (req, res) => {
  res.render("index", { path: EXPRESS_APP_PATH });
});

app.get(`${EXPRESS_APP_PATH}/createtable`, (req, res) => {
  res.render("createTable", { title: "Create Table Page", path: EXPRESS_APP_PATH });
});

app.get(`${EXPRESS_APP_PATH}/insert/:table`, (req, res) => {
  const tableName = req.params.table;
  res.render("insert", { tableName, path: EXPRESS_APP_PATH });
});

app.get(`${EXPRESS_APP_PATH}/edit/:table/:label/:id`, (req, res) => {
  const tableName = req.params.table;
  const id = req.params.id;
  res.render("edit", { tableName, id, path: EXPRESS_APP_PATH });
});

// SqliteGuiNode function to run the app
export async function SqliteGuiNode(db: Database, port = 8080) {
  await databaseFunctions.InitializeDB(db);
  app.use(`${EXPRESS_APP_PATH}/api/tables`, tableRoutes(db));
  app.listen(port, () => {
    logger.info(
      `SQLite Web Admin Tool running at http://localhost:${port}/home`
    );
  });
}

// SqliteGuiNode as middleware
export function SqliteGuiNodeMiddleware(app: any, db: Database) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await databaseFunctions.InitializeDB(db);
      app.set("view engine", "ejs");
      app.set("views", path.join(__dirname, "../views"));

      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(express.static(path.join(__dirname, "../public")));
      app.use(bodyParser.json());

      // Routes
      app.get(`${EXPRESS_APP_PATH}/query`, (req: Request, res: Response) => {
        res.render("query", { title: "Query Page", path: EXPRESS_APP_PATH });
      });

      app.get(EXPRESS_APP_PATH, (req: Request, res: Response) => {
        res.render("index", { path: EXPRESS_APP_PATH });
      });

      app.get(`${EXPRESS_APP_PATH}/createtable`, (req: Request, res: Response) => {
        res.render("createTable", { title: "Create Table Page", path: EXPRESS_APP_PATH });
      });

      app.get(`${EXPRESS_APP_PATH}/insert/:table`, (req: Request, res: Response) => {
        const tableName = req.params.table;
        res.render("insert", { tableName, path: EXPRESS_APP_PATH });
      });

      app.get(`${EXPRESS_APP_PATH}/edit/:table/:label/:id`, (req: Request, res: Response) => {
        const tableName = req.params.table;
        const id = req.params.id;
        res.render("edit", { tableName, id, path: EXPRESS_APP_PATH });
      });
      app.use(`${EXPRESS_APP_PATH}/api/tables`, tableRoutes(db)); // Add table routes
      app.get(`${EXPRESS_APP_PATH}/home`, (req: Request, res: Response) => {
        res.render("index", { path: EXPRESS_APP_PATH });
      });

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      // Handle any errors during DB initialization
      logger.error("Error initializing the database:", error);
      res.status(500).send("Error initializing the database.");
    }
  };
}
