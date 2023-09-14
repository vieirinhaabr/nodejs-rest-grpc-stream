export interface IAction<T, S> {
  call(params: T): S
}
