import { useFavoritesContext } from "@/app/hooks/useFavoritesContext";
import { useFavoriteProducts } from "@/app/hooks/useFavoriteProducts";
import { useFavoritesTotalValue } from "@/app/hooks/useFavoritesTotalValue";
import FavoriteItem from "../FavoriteItem/FavoriteItem";

export default function FavoritesList() {
  const favorites = useFavoriteProducts();
  const favoritesTotalValue = useFavoritesTotalValue();
  const { setFavorites } = useFavoritesContext();

  return (
    <div className="card mb-4">
      <div className="row card-body">
        <h5 className="card-title mb-4 fw-bold">Lista de favoritos:</h5>

        {favorites.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-borderless">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Preço</th>
                  <th>Desconto</th>
                  <th>Opções</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((item) => (
                  <FavoriteItem
                    key={item.id}
                    favoriteItem={item}
                    setFavorites={setFavorites}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Sua lista de favoritos está vazia.</p>
        )}
      </div>
      <div className="card-footer d-flex flex-column">
        <small className="text-muted">
          Quantidade de produtos: {favorites.length}
        </small>

        <small className="text-muted">
          Valor total: R$ {favoritesTotalValue}
        </small>
      </div>
    </div>
  );
}
