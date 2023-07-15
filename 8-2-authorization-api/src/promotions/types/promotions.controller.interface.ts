import { NextFunction, Request, Response } from 'express';

export interface IPromoController {
	create: (req: Request, res: Response, next: NextFunction) => void;
	delete: (req: Request, res: Response, next: NextFunction) => void;
	edit: (req: Request, res: Response, next: NextFunction) => void;
	list: (req: Request, res: Response, next: NextFunction) => void;
}
