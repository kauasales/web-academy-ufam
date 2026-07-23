export type Product = {
    id: string;
    nome: string; 
    fotos: {
        titulo: string;
        src: string;
    }[];
    preco: string;
    desconto: number;
    descricao: string;
    vendido: string;
    usuario_id: string; 
}