import 'reflect-metadata';

function Injectable(key: string) {
	return (target: Function) => {
		Reflect.defineMetadata(key, 1, target);
		const meta = Reflect.getMetadata(key, target);
		console.log(meta);
	};
}

function Invert(target: Object, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
	propertyDescriptor.value = function (...args: any[]) {
		return args[0].split('').reverse().join('');
	};
}

function Inject(key: string, target: Object) {
	const meta = Reflect.getMetadata(key, target);
	return meta;
}

function Prop(target: Object, name: string) {}

@Injectable('CC')
export class C {
	@Prop prop = 1;
}

@Injectable('BB')
export class B {
	@Prop prop: number;

	constructor(@Inject('C', C) c: C) {
		console.log(c.prop);
	}
}

new B(new C());
