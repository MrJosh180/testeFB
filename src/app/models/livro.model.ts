export class Livro {
	constructor(
		public id: string | null = null,
		public titulo: string = '',
		public autor?: string | null,
		public ano?: number | string | null,
	) {}

	// opcional: helper para criar a partir de um objeto bruto
	static from(o: any): Livro {
		return new Livro(o.id ?? null, o.titulo ?? '', o.autor ?? null, o.ano ?? null);
	}
}
