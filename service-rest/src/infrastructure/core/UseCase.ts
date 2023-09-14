export interface IUseCase<T, S> {
  execute(params: T): S;
}
