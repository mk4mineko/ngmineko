import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';

@Injectable()
export class UploadService {
  private api = environment.baseurl+'upload/api/';
  constructor (private http: Http) {}
  newFold(folder){
    let formData:FormData = new FormData();
    formData.append('mode', 'newfold');
    formData.append('project', 'empirica');
    formData.append('folder', folder);
    return this.http
      .post(this.api, formData) 
      .toPromise()
      .then(res => res.json())
  }
  getFold(){
    let formData:FormData = new FormData();
    formData.append('mode', 'getfold');
    formData.append('project', 'empirica');
    return this.http
      .post(this.api, formData) 
      .toPromise()
      .then(res => res.json())
  }
  delFold(folder){
    let formData:FormData = new FormData();
    formData.append('mode', 'delfold');
    formData.append('project', 'empirica');
    formData.append('folder', folder);
    return this.http
      .post(this.api, formData)
      .toPromise()
      .then(res => res.json())
  }
  getFile(folder){
    let formData:FormData = new FormData();
    formData.append('mode', 'getfile');
    formData.append('project', 'empirica');
    formData.append('folder', folder);
    return this.http
      .post(this.api, formData) 
      .toPromise()
      .then(res => res.json())
  }
  upload(id,file,folder){
    let formData:FormData = new FormData();
    formData.append('mode', 'upload');
    formData.append('project', 'empirica');
    formData.append('folder', folder);
    formData.append('id', id);
    formData.append('file', file);
    return this.http
      .post(this.api, formData) 
      .toPromise()
      .then(res => res.json())
  }
  delete(file,folder){
    let formData:FormData = new FormData();
    formData.append('mode', 'delete');
    formData.append('project', 'empirica');
    formData.append('folder', folder);
    formData.append('id', file.id);
    formData.append('name', file.name);
    return this.http
      .post(this.api, formData)
      .toPromise()
      .then(res => res.json())
  }

}