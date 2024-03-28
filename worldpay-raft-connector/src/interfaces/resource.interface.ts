// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Payload {
  action: string
  resource: {
    typeId: string
  }
  id: string
  obj: any
}
