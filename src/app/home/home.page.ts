import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonInput, IonButton, IonList, IonListHeader, IonLabel,
  IonSearchbar
} from '@ionic/angular/standalone';
// import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { Livro } from '../models/livro.model';
import { LivroService } from '../service/livro.service';
import { Observable } from 'rxjs';

// interface Livro {
//   id: string;
//   title: string;
//   author?: string;
//   year?: string | number;
// }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonInput, IonButton, IonList, IonListHeader, IonLabel, IonSearchbar
  
  ],
  templateUrl: './home.page.html',
})
export class HomePage {
  private svc = inject(LivroService);
  livros$: Observable<Livro[]>;

  novoTitulo: string = '';
  novoAutor: string = '';
  novoAno: number | null = null;

  termo = '';

  // id do livro que está sendo editado (ou null se modo "adicionar")
  editingId: string | null = null;

  constructor() {
    this.livros$ = this.svc.listar$();
  }

  buscar(ev?: Event | CustomEvent) {
    // O evento emitido pelo componente do Ionic é um CustomEvent com 'detail.value',
    // mas o template pode tipá-lo como Event — aceitamos ambos e fazemos um cast seguro.
    const valor = ((ev as CustomEvent)?.detail as any)?.value ?? this.termo;
    this.termo = (valor || '').trim();

    if (!this.termo) {
      this.livros$ = this.svc.listar$();
    } else {
      this.livros$ = this.svc.buscarPorTitulo$(this.termo);
    }
  }

  async adicionar() {
    const titulo = (this.novoTitulo ?? '').trim();
    const autor = (this.novoAutor ?? '').trim();
    const ano = this.novoAno == null ? undefined : Number(this.novoAno);

    if (!titulo) return;

    if (this.editingId) {
      // atualizar
      await this.svc.atualizar(this.editingId, { titulo, autor: autor || undefined, ano });
      this.editingId = null;
    } else {
      // criar
      await this.svc.criar({ titulo, autor: autor || undefined, ano });
    }

    this.novoTitulo = '';
    this.novoAutor = '';
    this.novoAno = null;
  }

  iniciarEdicao(livro: Livro) {
    if (!livro.id) return;
    this.editingId = livro.id;
    this.novoTitulo = livro.titulo ?? '';
    this.novoAutor = livro.autor ?? '';
    this.novoAno = livro.ano == null ? null : Number(livro.ano);
  }

  cancelarEdicao() {
    this.editingId = null;
    this.novoTitulo = '';
    this.novoAutor = '';
    this.novoAno = null;
  }

  async excluir(livro: Livro) {
    if (!livro.id) return;
    if (!confirm(`Excluir "${livro.titulo}"?`)) return;
    await this.svc.excluir(livro.id);
  }

//   form: FormGroup;
//   books: Book[] = [];
//   editingId: string | null = null;

//   private storageKey = 'books';

//   constructor(private fb: FormBuilder) {
//     this.form = this.fb.group({
//       title: ['', Validators.required],
//       author: [''],
//       year: [''],
//     });

//     this.loadBooks();
//   }

//   private loadBooks() {
//     try {
//       const raw = localStorage.getItem(this.storageKey);
//       this.books = raw ? JSON.parse(raw) : [];
//     } catch (e) {
//       this.books = [];
//     }
//   }

//   private saveBooks() {
//     localStorage.setItem(this.storageKey, JSON.stringify(this.books));
//   }

//   addOrUpdate() {
//     if (this.form.invalid) return;

//     const { title, author, year } = this.form.value;

//     if (this.editingId) {
//       const idx = this.books.findIndex(b => b.id === this.editingId);
//       if (idx >= 0) {
//         this.books[idx] = { ...this.books[idx], title, author, year };
//       }
//       this.editingId = null;
//     } else {
//       const book: Book = {
//         id: this.uuid(),
//         title,
//         author,
//         year,
//       };
//       this.books.unshift(book);
//     }

//     this.saveBooks();
//     this.form.reset();
//   }

//   edit(book: Book) {
//     this.editingId = book.id;
//     this.form.setValue({ title: book.title ?? '', author: book.author ?? '', year: book.year ?? '' });
//     // opcional: rolar para o topo para ver o formulário
//     try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
//   }

//   cancel() {
//     this.editingId = null;
//     this.form.reset();
//   }

//   remove(book: Book) {
//     if (!confirm(`Excluir "${book.title}"?`)) return;
//     this.books = this.books.filter(b => b.id !== book.id);
//     this.saveBooks();
//   }

//   private uuid() {
//     return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
//   }
}
