import express, { Request, Response } from "express";
import { EXPRESS_APP_PATH, PRIVATE_KEY } from '../config/env-vars';
import  Cryptr  from 'cryptr';

import type { Database } from "sqlite3";
import databaseFunctions from "../Utils/databaseFunctions";

const router = express.Router();

export function loginRoutes(db: Database){

    router.post("/", async (req: Request, res: Response)=> {
        try{
            const username: string = req.body.username,
                password: string = req.body.password,
                userRes= await databaseFunctions.fetchUser(db, username);
            if(userRes.bool && userRes.data) {
                const cryptr = new Cryptr(PRIVATE_KEY!),
                    decryptedPassword = cryptr.decrypt(userRes.data.password);
                if(password === decryptedPassword){
                    // @ts-ignore
                    req.session.user = {
                        id: userRes.data.id,
                        username,
                        name: username
                    }
                    res.redirect(`${EXPRESS_APP_PATH}/home`)
                } else {
                    res.render("login", { path: EXPRESS_APP_PATH, error: "Wrong credentials, please try again." });
                }
            } else {
                res.render("login", { path: EXPRESS_APP_PATH, error: "Wrong credentials, please try again." });
            }
        } catch (e) {
            res.status(500).json({ message: "Internal server error" });
        }
    });

    return router;
}

