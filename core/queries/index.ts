export interface Query<Request, Response> {
  fetch(input: Request): Promise<Response>
}