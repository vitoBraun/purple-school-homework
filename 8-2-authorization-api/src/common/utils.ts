export function resolveListQuery(params?: Record<string, any>): Record<string, any> {
	if (params) {
		const paggination = params?.page &&
			params?.perPage && {
				take: Number(params.perPage),
				skip: (Number(params.page) - 1) * Number(params.perPage),
			};
		delete params?.page, delete params?.perPage;
		if (params?.id) {
			params.id = Number(params.id);
		}
		return { filter: { ...params }, paggination, restParams: params };
	}
	return { filter: undefined, paggination: undefined, restParams: params };
}
