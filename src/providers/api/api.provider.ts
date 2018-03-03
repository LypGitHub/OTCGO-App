import { HttpClient } from '@angular/common/http'
import { Injectable, OnDestroy } from '@angular/core'

import { dev } from '../../environments/environment'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { takeUntil, timeout } from 'rxjs/operators'


@Injectable()
export class ApiProvider implements OnDestroy {
	otcgoApi = 'http://api.otcgo.cn'
	onDestroy = new Subject()

	constructor (private http: HttpClient) {}

	getAPIEndpoint () {
		return dev
			? `${this.otcgoApi}/testnet`
			: `${this.otcgoApi}/mainnet`
	}

	ngOnDestroy () {
		this.onDestroy.next()
	}

	request (method, url, options?: any) {
		return this.http
		           .request(method, url, options)
		           .pipe(
								 takeUntil(this.onDestroy),
								 timeout(300)
							 )
		
	}

	get (endpoint: string, options?: any): Observable<any> {
		console.log(endpoint)
		return this.http
		           .get(this.getAPIEndpoint() + '/' + endpoint, options)
		           .pipe(
			           timeout(10000)
		           )
	}

	post (endpoint: string, body: any, options?: any): Observable<any> {
		return this.http
		           .post(this.getAPIEndpoint() + '/' + endpoint, body, options)
		           .pipe(
			           timeout(10000)
		           )
	}

	broadcast (body) {
		return this.http
		           .post(`${this.getAPIEndpoint()}/broadcast`, body)
		           .pipe(
			           timeout(10000)
		           )
	}

}
