import { NextFunction, Request, Response } from "express";
import { EXPRESS_APP_PATH } from './config/env-vars';

export function isUserLoggedIn(req: Request, res: Response, next: NextFunction){
    // @ts-ignore
    if(req.session.user){
        next();
    } else {
        res.redirect(`${EXPRESS_APP_PATH}/login`);
    }
}