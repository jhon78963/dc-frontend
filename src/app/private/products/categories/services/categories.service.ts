import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  map,
  Observable,
  switchMap
} from 'rxjs';
import { ApiService } from '../../../../services/api.service';
import { Category, CategoryListResponse } from '../models/categories.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Spinner1Service } from '../../../../services/spinner1.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  categories: Category[] = [];
  total: number = 0;
  categories$: BehaviorSubject<Category[]>  = new BehaviorSubject<Category[]>(this.categories);
  total$: BehaviorSubject<number>   = new BehaviorSubject<number>(this.total);
  spinner1:Spinner1Service;

  constructor(private readonly apiService: ApiService,private spinner1Service: Spinner1Service) {
    this.spinner1 = spinner1Service;
  }

  callGetList(
    limit: number = 10,
    page: number = 1,
    name: string = '',
  ): Observable<void> {
    let url = `categories?limit=${limit}&page=${page}`;
    if (name) {
      url += `&search=${name}`;
    }
    return this.apiService.get<CategoryListResponse>(url).pipe(
      debounceTime(600),
      map((response: CategoryListResponse) => {
        this.updateBrands(response.data);
        this.updateTotalBrands(response.paginate.total);
      }),
    );
  }

  getList(): Observable<Category[]> {
    return this.categories$.asObservable();
  }

  getTotal(): Observable<number> {
    return this.total$.asObservable();
  }

  getOne(id: number): Observable<Category> {
    return this.apiService.get(`categories/${id}`);
  }

  /*
  create(data: Brand): Observable<void> {
    return this.apiService
      .post('brands', data)
      .pipe(switchMap(() => this.callGetList()));
  }
  */

  create(data: Category): Observable<HttpResponse<any>> {
    return this.apiService.post<any>(`categories`, data);
  }

  /*
  edit(id: number, data: Brand): Observable<void> {
    return this.apiService
      .patch(`brands/${id}`, data)
      .pipe(switchMap(() => this.callGetList()));
  }
  */

  edit(id: number, data: Category): Observable<HttpResponse<any>> {
    return this.apiService.patch<any>(`categories/${id}`, data, { observe: 'response' });
  }

  delete(id: number): Observable<void> {
    return this.apiService
      .delete(`categories/${id}`)
      .pipe(switchMap(() => this.callGetList()));
  }

  private updateBrands(value: Category[]): void {
    this.categories = value;
    this.categories$.next(this.categories);
  }

  private updateTotalBrands(value: number): void {
    this.total = value;
    this.total$.next(this.total);
  }
}
