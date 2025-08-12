"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqliteGuiNodeMiddleware = exports.SqliteGuiNode = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const databaseFunctions_1 = __importDefault(require("./Utils/databaseFunctions"));
const logger_1 = __importDefault(require("./Utils/logger"));
const login_1 = require("./routes/login");
const tables_1 = __importDefault(require("./routes/tables"));
const env_vars_1 = require("./config/env-vars");
const middlewares_1 = require("./middlewares");
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "../views"));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use(body_parser_1.default.json());
// Routes
app.get(`${env_vars_1.EXPRESS_APP_PATH}/query`, (req, res) => {
    res.render("query", { title: "Query Page", path: env_vars_1.EXPRESS_APP_PATH });
});
app.get(`${env_vars_1.EXPRESS_APP_PATH}/home`, (req, res) => {
    res.render("index", { path: env_vars_1.EXPRESS_APP_PATH });
});
app.get(`${env_vars_1.EXPRESS_APP_PATH}/createtable`, (req, res) => {
    res.render("createTable", { title: "Create Table Page", path: env_vars_1.EXPRESS_APP_PATH });
});
app.get(`${env_vars_1.EXPRESS_APP_PATH}/insert/:table`, (req, res) => {
    const tableName = req.params.table;
    res.render("insert", { tableName, path: env_vars_1.EXPRESS_APP_PATH });
});
app.get(`${env_vars_1.EXPRESS_APP_PATH}/edit/:table/:label/:id`, (req, res) => {
    const tableName = req.params.table;
    const id = req.params.id;
    res.render("edit", { tableName, id, path: env_vars_1.EXPRESS_APP_PATH });
});
// SqliteGuiNode function to run the app
function SqliteGuiNode(db_1) {
    return __awaiter(this, arguments, void 0, function* (db, port = 8080) {
        yield databaseFunctions_1.default.InitializeDB(db);
        app.use(`${env_vars_1.EXPRESS_APP_PATH}/api/tables`, (0, tables_1.default)(db));
        app.listen(port, () => {
            logger_1.default.info(`SQLite Web Admin Tool running at http://localhost:${port}/home`);
        });
    });
}
exports.SqliteGuiNode = SqliteGuiNode;
// SqliteGuiNode as middleware
function SqliteGuiNodeMiddleware(app, db) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield databaseFunctions_1.default.InitializeDB(db);
                const session = require('express-session');
                app.set("view engine", "ejs");
                app.set("views", path_1.default.join(__dirname, "../views"));
                // app.use(bodyParser.urlencoded({ extended: false }));
                app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
                // app.use(bodyParser.json());
                app.use(session({
                    secret: env_vars_1.EXPRESS_SESSION_SECRET,
                    resave: true,
                    saveUninitialized: false
                }));
                // Routes
                app.get(`${env_vars_1.EXPRESS_APP_PATH}/query`, middlewares_1.isUserLoggedIn, (req, res) => {
                    res.render("query", { title: "Query Page", path: env_vars_1.EXPRESS_APP_PATH });
                });
                app.get(env_vars_1.EXPRESS_APP_PATH, middlewares_1.isUserLoggedIn, (req, res) => {
                    res.render("index", { path: env_vars_1.EXPRESS_APP_PATH });
                });
                app.get(`${env_vars_1.EXPRESS_APP_PATH}/createtable`, middlewares_1.isUserLoggedIn, (req, res) => {
                    res.render("createTable", { title: "Create Table Page", path: env_vars_1.EXPRESS_APP_PATH });
                });
                app.get(`${env_vars_1.EXPRESS_APP_PATH}/insert/:table`, middlewares_1.isUserLoggedIn, (req, res) => {
                    const tableName = req.params.table;
                    res.render("insert", { tableName, path: env_vars_1.EXPRESS_APP_PATH });
                });
                app.get(`${env_vars_1.EXPRESS_APP_PATH}/edit/:table/:label/:id`, middlewares_1.isUserLoggedIn, (req, res) => {
                    const tableName = req.params.table;
                    const id = req.params.id;
                    res.render("edit", { tableName, id, path: env_vars_1.EXPRESS_APP_PATH });
                });
                app.use(`${env_vars_1.EXPRESS_APP_PATH}/api/tables`, middlewares_1.isUserLoggedIn, (0, tables_1.default)(db)); // Add table routes
                app.get(`${env_vars_1.EXPRESS_APP_PATH}/home`, middlewares_1.isUserLoggedIn, (req, res) => {
                    res.render("index", { path: env_vars_1.EXPRESS_APP_PATH });
                });
                app.use(`${env_vars_1.EXPRESS_APP_PATH}/login`, (0, login_1.loginRoutes)(db));
                app.get(`${env_vars_1.EXPRESS_APP_PATH}/login`, (req, res) => {
                    // @ts-ignore
                    if (req.session.user) {
                        res.redirect(`${env_vars_1.EXPRESS_APP_PATH}/home`);
                    }
                    else {
                        res.render("login", { path: env_vars_1.EXPRESS_APP_PATH, error: null });
                    }
                });
                next(); // Proceed to the next middleware/route handler
            }
            catch (error) {
                // Handle any errors during DB initialization
                logger_1.default.error("Error initializing the database:", error);
                res.status(500).send("Error initializing the database.");
            }
        });
    };
}
exports.SqliteGuiNodeMiddleware = SqliteGuiNodeMiddleware;
