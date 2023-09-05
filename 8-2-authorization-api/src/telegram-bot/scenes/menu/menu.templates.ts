export const getItemTemplate = ({
	name,
	description,
	price,
}: {
	name: string;
	description: string;
	price: number;
}): string => {
	return `Товар: ${name} 
Описание: ${description} 
Цена:  ${price}`;
};
