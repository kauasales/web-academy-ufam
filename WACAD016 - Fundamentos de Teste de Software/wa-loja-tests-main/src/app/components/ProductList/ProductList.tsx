import ProductCard from "../ProductCard/ProductCard";
import { useFavoritesContext } from "@/app/hooks/useFavoritesContext";

interface IProductList {
  products: Product[];
}

export default function ProductList({ products }: IProductList) {
  const { setFavorites } = useFavoritesContext();

  return (
    <>
      <h5 className="mb-3 fw-bold">Produtos disponíveis:</h5>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            setFavorites={setFavorites}
          />
        ))}
      </div>
    </>
  );
}
