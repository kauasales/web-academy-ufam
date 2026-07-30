export interface Photo {
  titulo: string
  src: string
}

export interface Product {
  id: string
  fotos: Photo[]
  nome: string
  preco: string
  desconto: number
  descricao: string
  vendido: string
  usuario_id: string
}
