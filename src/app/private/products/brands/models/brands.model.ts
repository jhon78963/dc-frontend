export interface IBrand {
  id: number;
  name: string;
}

export class Brand {
  id: number;
  name: string;

  constructor(brand: IBrand) {
    this.id   = brand.id;
    this.name = brand.name;
  }
}

export interface Paginate {
  total: number;
  pages: number;
}

export interface BrandListResponse {
  data: Brand[];
  paginate: Paginate;
}
