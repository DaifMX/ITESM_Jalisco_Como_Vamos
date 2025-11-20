import CategoriesRepository from "@/repositories/CategoriesRepository";

import { ElementNotFoundError } from "@jcv/errors";

export default class CategoryService {
    private repository = new CategoriesRepository();

    public getAll = async () => {
        const categories = await this.repository.getAll();
        if (!categories.length) throw new ElementNotFoundError('Categorías no encontradas en la base de datos.');

        return categories;
    };

    public getById = async (id: string) => {
        const category = await this.repository.getById(id);
        if (!category) throw new ElementNotFoundError(`Categoría ID-${id} no encontrada en la base de datos.`);

        return category;
    };
}
