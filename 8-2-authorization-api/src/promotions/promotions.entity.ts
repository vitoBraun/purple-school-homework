import { Status } from '../types/types';

export class Promo {
	private _creatorId: number;
	private _status: Status = 'new';

	constructor(private readonly _title: string, private readonly _description: string) {}
	get title(): string {
		return this._title;
	}

	get description(): string {
		return this._description;
	}

	get creatorId(): number {
		return this._creatorId;
	}
	get status(): Status {
		return this._status;
	}
}
