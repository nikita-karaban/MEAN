import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: any
  user: any

  constructor(
    private http : Http
  ) { }

  // метод, который регистрирует нашего пользователя
  registerUser(user) {
    // формируем заголовок, в котором тип контента, которым мы отправляем на сервер, является объект формата json
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    // дклаем запрос на сервер
    // мы делаем post запрос в котором передаем объект нашего пользователя
    // получаем ответ, и этот ответ мы преобразуем в ответ формата json
    return this.http.post('http://localhost:3000/account/reg', user,
    { headers: headers}).pipe(map(res => res.json()))
  }
   // метод, который авторизирует  нашего пользователя
  authUser(user) {
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return this.http.post('http://localhost:3000/account/auth', user,
    { headers: headers}).pipe(map(res => res.json()))
  }
  // данный метод хранит данные об пользователе
  storeUser(token, user) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))

    this.token = token
    this.user = user
  }

  logout() {
    this.token = null
    this.user = null
    localStorage.clear()
  }

  // метод, который проверяет авторизован погльзователь или нет
  isAuthenticated() {
    return tokenNotExpired()
  }

  createPost(post) {
    let headers = new Headers()
    headers.append('Authorization', localStorage.getItem('token'))
    headers.append('Content-Type', 'application/json')
    return this.http.post('http://localhost:3000/account/dashboard', post,
    { headers: headers}).pipe(map(res => res.json()))
  }

  getAllPosts() {
    return this.http.get('http://localhost:3000' ).pipe(map(res => res.json()))
  }

  getPostById(id) {
    return this.http.get(`http://localhost:3000/post/${id}` ).pipe(map(res => res.json()))
  }

  deletePost(id) {
    let headers = new Headers()
    headers.append('Authorization', localStorage.getItem('token'))
    return this.http.delete(`http://localhost:3000/post/${id}`, { headers: headers} ).pipe(map(res => res.json()))
  }
}
