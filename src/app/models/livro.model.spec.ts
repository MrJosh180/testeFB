import { Livro } from '../models/livro.model';

describe('Livro', () => {
  it('should create an instance', () => {
    expect(new Livro()).toBeTruthy();
  });
});
