import { useIsProductFavorite } from "@/app/hooks/useIsProductFavorite";
import { calculatePriceWithDiscount } from "@/app/helpers";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  setFavorites: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function ProductCard({
  product,
  setFavorites,
}: ProductCardProps) {
  const isFavorite = useIsProductFavorite(product.id);

  const addToFavorites = (product: Product) => {
    setFavorites((favorites) => [...favorites, product]);
  };

  return (
    <div className="col">
      <div className="card shadow-sm h-100">
        <Image
          src={product.fotos[0].src}
          className="card-img-top"
          alt={product.fotos[0].titulo}
          width={300}
          height={320}
        />

        <div className="card-body bg-ligth">
          <span className="badge text-bg-success text-white mb-2">
            {product.desconto}% de desconto
          </span>
          <h5 className="card-title fw-bold">{product.nome}</h5>
          <span className="text-secondary">De R$ {product.preco}</span>
          <h5 className="card-text">
            Por R${" "}
            {calculatePriceWithDiscount(
              Number(product.preco),
              product.desconto
            )}
          </h5>

          <button
            className={
              isFavorite
                ? "btn btn-success d-block w-100"
                : "btn btn-secondary d-block w-100"
            }
            type="button"
            onClick={() => addToFavorites(product)}
            disabled={isFavorite}
          >
            {isFavorite
              ? "Adicionado aos favoritos"
              : "Adicionar aos favoritos"}
          </button>
        </div>
      </div>
    </div>
  );
}
