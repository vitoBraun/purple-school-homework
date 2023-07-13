import { Logger } from 'tslog';

export interface ILogger {
	logger: Logger;
	getMessageString: (...args: unknown[]) => string;
	log: (...args: unknown[]) => void;
	error: (...args: unknown[]) => void;
	warn: (...args: unknown[]) => void;
}
