import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../features/product/productSlice';
import { RootState, AppDispatch } from '../app/store';
import ProductForm from '../components/ProductForm';
import jwt_decode from 'jwt-decode';

type DecodedToken = {
  id: number;
  role: string;
};

export default function Inventory() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector((state: RootState) => state.products);

  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwt_decode<DecodedToken>(token);
      setIsAdmin(decoded.role === 'admin');
    }
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>

      {isAdmin && (
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      )}

      {showForm && (
        <ProductForm
          initialValues={editingProduct || undefined}
          onSuccess={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-3">
          {products.map((p) => (
            <li key={p.id} className="border p-4 rounded shadow flex justify-between items-center">
              <div>
                <strong>{p.name}</strong> – Qty: {p.quantity} – ${p.price.toFixed(2)}
              </div>

              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setShowForm(true);
                    }}
                    className="text-sm bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => dispatch(deleteProduct(p.id))}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
