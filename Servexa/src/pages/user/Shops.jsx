import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getShops } from "../../services/shopService";
import ShopCard from "../../components/shop/ShopCard";

export default function Shops() {
  const { categoryId } = useParams();
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getShops(categoryId).then(setShops);
  }, [categoryId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Shops</h1>

      <div className="grid gap-4">
        {shops.map((shop) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            onClick={() => navigate(`/user/shops/${shop.id}/services`)}
          />
        ))}
      </div>
    </div>
  );
}
