import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import { ApiService } from '../../../../services/api.service';
import { Brand, BrandListResponse } from '../models/brands.model';
import { HttpResponse } from '@angular/common/http';
import { Spinner1Service } from '../../../../services/spinner1.service';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  brands: Brand[] = [];
  total: number = 0;
  brands$: BehaviorSubject<Brand[]> = new BehaviorSubject<Brand[]>(this.brands);
  total$: BehaviorSubject<number> = new BehaviorSubject<number>(this.total);
  spinner1: Spinner1Service;

  constructor(
    private readonly apiService: ApiService,
    private spinner1Service: Spinner1Service,
  ) {
    this.spinner1 = spinner1Service;
  }

  callGetList(
    limit: number = 10,
    page: number = 1,
    name: string = '',
  ): Observable<void> {
    let url = `brands?limit=${limit}&page=${page}`;
    if (name) {
      url += `&search=${name}`;
    }
    return this.apiService.get<BrandListResponse>(url).pipe(
      debounceTime(600),
      map((response: BrandListResponse) => {
        this.updateBrands(response.data);
        this.updateTotalBrands(response.paginate.total);
      }),
    );
  }

  getList(): Observable<Brand[]> {
    return this.brands$.asObservable();
  }

  getTotal(): Observable<number> {
    return this.total$.asObservable();
  }

  getOne(id: number): Observable<Brand> {
    return this.apiService.get(`brands/${id}`);
  }

  /*
  create(data: Brand): Observable<void> {
    return this.apiService
      .post('brands', data)
      .pipe(switchMap(() => this.callGetList()));
  }
  */

  create(data: Brand): Observable<void> {
    return this.apiService
      .post(`brands`, data)
      .pipe(switchMap(() => this.callGetList()));
  }

  /*
  edit(id: number, data: Brand): Observable<void> {
    return this.apiService
      .patch(`brands/${id}`, data)
      .pipe(switchMap(() => this.callGetList()));
  }
  */

  edit(id: number, data: Brand): Observable<HttpResponse<any>> {
    return this.apiService.patch<any>(`brands/${id}`, data, {
      observe: 'response',
    });
  }

  delete(id: number): Observable<void> {
    return this.apiService
      .delete(`brands/${id}`)
      .pipe(switchMap(() => this.callGetList()));
  }

  private updateBrands(value: Brand[]): void {
    this.brands = value;
    this.brands$.next(this.brands);
  }

  private updateTotalBrands(value: number): void {
    this.total = value;
    this.total$.next(this.total);
  }
}
