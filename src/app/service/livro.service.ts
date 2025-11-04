import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc,
  query, orderBy, startAt, endAt
} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Livro } from '../models/livro.model';

export interface CriarLivroDTO {
  titulo: string;
  autor?: string;
  ano?: number | string;
}

export interface AtualizarLivroDTO {
  titulo?: string;
  autor?: string;
  ano?: number | string;
}

@Injectable({ providedIn: 'root' })
export class LivroService {
  private firestore = inject(Firestore);
  private readonly colecao = 'livros';

  /** Lista reativa padrão, por título */
  listar$(): Observable<Livro[]> {
    const ref = collection(this.firestore, this.colecao);
    const q = query(ref, orderBy('titulo'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((rows: any[]) => rows.map(r =>
        new Livro(r.id ?? null, r.titulo ?? '', r.autor ?? '', r.ano ?? null)
      ))
    );
  }

  /** Busca por prefixo do título (simples) */
  buscarPorTitulo$(termo: string): Observable<Livro[]> {
    const ref = collection(this.firestore, this.colecao);
    const inicio = termo;
    const fim = termo + '\uf8ff'; // truque para "prefixo"
    const q = query(ref, orderBy('titulo'), startAt(inicio), endAt(fim));
    return collectionData(q, { idField: 'id' }).pipe(
      map((rows: any[]) => rows.map(r =>
        new Livro(r.id ?? null, r.titulo ?? '', r.autor ?? '', r.ano ?? null)
      ))
    );
  }

  async criar(dto: CriarLivroDTO): Promise<string> {
    const ref = collection(this.firestore, this.colecao);
    const res = await addDoc(ref, {
      titulo: dto.titulo,
      autor: dto.autor ?? null,
      ano: dto.ano ?? null,
    });
    return res.id;
  }

  async atualizar(id: string, dto: AtualizarLivroDTO): Promise<void> {
    const d = doc(this.firestore, this.colecao, id);
    await updateDoc(d, { ...dto });
  }

  async excluir(id: string): Promise<void> {
    const d = doc(this.firestore, this.colecao, id);
    await deleteDoc(d);
  }
}

export { Livro };
