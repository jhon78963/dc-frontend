export interface ICategory {
  id: number;
  name: string;
}

export class Category {
  id: number;
  name: string;

  constructor(category: ICategory) {
    this.id   = category.id;
    this.name = category.name;
  }
}

export interface Paginate {
  total: number;
  pages: number;
}

export interface CategoryListResponse {
  data: Category[];
  paginate: Paginate;
}
