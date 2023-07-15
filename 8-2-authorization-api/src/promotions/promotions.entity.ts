export class Promo {
	constructor(
		private readonly _title: string,
		private readonly _description: string,
		private readonly _creatorEmail: string,
	) {}
	get title(): string {
		return this._title;
	}

	get description(): string {
		return this._description;
	}

	get creatorEmail(): string {
		return this._creatorEmail;
	}
}
