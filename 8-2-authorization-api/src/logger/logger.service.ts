import { Logger } from 'tslog';
import { ILogger } from './logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';
@injectable()
export class LoggerService implements ILogger {
	public logger: Logger;
	private messageString = '';

	constructor() {
		this.logger = new Logger({
			displayInstanceName: false,
			displayLoggerName: false,
			displayFilePath: 'hidden',
			displayFunctionName: false,
		});
	}
	getMessageString(...args: unknown[]): string {
		if (args.length > 1) {
			const restArgs = ` (${args.slice(2).join('')})`;
			const mainMessage = `[${args[1]}] ${args[0]}`;
			this.messageString = mainMessage + (args[2] ? restArgs : '');
		} else {
			this.messageString = `[info] ${args[0]}`;
		}
		return this.messageString;
	}

	log(...args: unknown[]): void {
		this.logger.info(this.getMessageString(...args));
	}
	error(...args: unknown[]): void {
		this.logger.error(this.getMessageString(...args));
	}
	warn(...args: unknown[]): void {
		this.logger.warn(this.getMessageString(...args));
	}
}
