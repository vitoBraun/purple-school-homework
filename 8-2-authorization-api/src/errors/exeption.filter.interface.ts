import { Request, Response, NextFunction } from 'express';

export interface IExeptionFilter {
	catch: (error: Error, req: Request, res: Response, next: NextFunction) => void;
}
