import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tarefa } from "./tarefa";
import { ItemComponent } from './item/item';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css',
  imports: [CommonModule, ItemComponent]
})
export class App {
  protected readonly title = signal('TODOapp');

  arrayDeTarefas = signal<Tarefa[]>([]);
  identificador = signal('');
  apiURL: string;
  usuarioLogado = signal(false);
  tokenJWT = '{ "token":""}';

  constructor(private http: HttpClient) {
    this.apiURL = environment.apiURL;
    this.READ_tarefas();
  }

  CREATE_tarefa(descricaoNovaTarefa: string) {
    var novaTarefa = new Tarefa(descricaoNovaTarefa, false);
    this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa).subscribe(
      resultado => { console.log(resultado); this.READ_tarefas(); });
  }
  READ_tarefas() {
    const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
    this.http.get<{ identificador: string; tarefas: Tarefa[] }>(`${this.apiURL}/api/getAll`, { 'headers': idToken }).subscribe(
    (resultado) => {
      this.arrayDeTarefas.set(resultado.tarefas);
      this.identificador.set(resultado.identificador);
      this.usuarioLogado.set(true)
    },
    (error) => { this.usuarioLogado.set(false) }
    );
  }

  DELETE_tarefa(tarefaAserRemovida: Tarefa) {
    var indice = this.arrayDeTarefas().indexOf(tarefaAserRemovida);
    var id = this.arrayDeTarefas()[indice]._id;
    this.http.delete<Tarefa>(`${this.apiURL}/api/delete/${id}`).subscribe(
      resultado => { console.log(resultado); this.READ_tarefas(); });
}
  UPDATE_tarefa(tarefaAserModificada: Tarefa) {
    var indice = this.arrayDeTarefas().indexOf(tarefaAserModificada);
    var id = this.arrayDeTarefas()[indice]._id;
    this.http.patch<Tarefa>(`${this.apiURL}/api/update/${id}`,
      tarefaAserModificada).subscribe(
        resultado => { console.log(resultado); this.READ_tarefas(); });
    }
// Modificar depois para usar o tokenJWT
  // login(username: string, password: string) {
  // var credenciais = { "nome": username, "senha": password }
  // this.http.post(`${this.apiURL}/api/login`, credenciais).subscribe(resultado => {
  // this.tokenJWT = JSON.stringify(resultado);
  // this.READ_tarefas();
  // });
  // }


}