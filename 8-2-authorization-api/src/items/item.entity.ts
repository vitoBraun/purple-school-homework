export class Item {
	constructor(
		private readonly _name: string,
		private readonly _description: string,
		private readonly _price: number,
		private readonly _storeCount: number,
	) {}
	get name(): string {
		return this._name;
	}

	get description(): string {
		return this._description;
	}

	get price(): number {
		return this._price;
	}

	get storeCount(): number {
		return this._storeCount;
	}
}
