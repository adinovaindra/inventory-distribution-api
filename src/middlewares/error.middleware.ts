import { NextFunction, Request, Response } from "express";
import { BaseError } from "../utils/error";

export const errorHandler = (err:Error, req:Request, res:Response, next:NextFunction) => {
    if (err instanceof BaseError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    } else {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}