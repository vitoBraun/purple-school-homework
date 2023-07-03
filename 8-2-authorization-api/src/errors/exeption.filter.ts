import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';
import { IExeptionFilter } from './exeption.filter.interface';
import { HttpError } from './http-error.class';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../users/types';
import { injectable, inject } from 'inversify';

@injectable()
export class ExecptionFilter implements IExeptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}
	catch(error: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
		if (error instanceof HttpError) {
			this.logger.error(`[${error.context}] Error: ${error.statusCode} ${error.message}`);
			res.status(error.statusCode).send({ err: error.message });
		} else {
			this.logger.error(`${error.message}`);
			res.status(500).send({ err: error.message });
		}
	}
}
