import { NextFunction, Request, Response } from 'express';

export interface IItemsController {
	create: (req: Request, res: Response, next: NextFunction) => void;
	createCategory: (req: Request, res: Response, next: NextFunction) => void;
	getCategories: (req: Request, res: Response, next: NextFunction) => void;
	getItems: (req: Request, res: Response, next: NextFunction) => void;
}
