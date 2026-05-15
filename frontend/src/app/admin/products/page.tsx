"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Package, Plus, Edit, Trash2, Eye, ShoppingBag } from "lucide-react";
import CreateProductModal from "@/components/admin/CreateProductModal";
import EditProductModal from "@/components/admin/EditProductModal";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sale: number;
  stock: number;
  status: string;
  image?: { id: number; url: string }[];
  colors?: string[];
  sizes?: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/product/listAdmin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data.products?.rows || data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: number, productName: string) => {
    if (confirm(`Are you sure you want to delete "${productName}"?`)) {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`http://localhost:5000/api/product/delete/${productId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setProducts(products.filter(p => p.id !== productId));
          alert("Product deleted successfully");
        } else {
          alert("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toString().includes(searchTerm)
  );

  const stats = {
    total: products.length,
    active: products.filter(p => p.status !== "inactive").length,
    lowStock: products.filter(p => p.stock < 10).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-3 border-brown-warm border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-light">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brown-warm/20 mb-4">
            <Package className="w-8 h-8 text-brown-dark" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-brown-dark">Product Management</h1>
          <p className="text-brown-dark/70 mt-2">Manage your product catalog</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-brown-warm">
            <p className="text-sm font-medium text-brown-warm">Total Products</p>
            <p className="text-2xl font-bold text-brown-dark">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
            <p className="text-sm font-medium text-green-600">Active Products</p>
            <p className="text-2xl font-bold text-green-700">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
            <p className="text-sm font-medium text-red-600">Low Stock</p>
            <p className="text-2xl font-bold text-red-700">{stats.lowStock}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-emerald-600">
            <p className="text-sm font-medium text-emerald-600">Inventory Value</p>
            <p className="text-2xl font-bold text-emerald-700">${stats.totalValue.toFixed(2)}</p>
          </div>
        </div>

        {/* Search and Add */}
        <div className="bg-white rounded-xl shadow-sm border border-beige-medium p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brown-warm" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by product name or ID..."
                  className="w-full pl-10 pr-4 py-2.5 bg-beige-light/50 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-warm focus:border-transparent text-brown-dark font-medium placeholder:text-brown-warm/50"
                />
              </div>
            </div>
            <Link href="/admin/products/create">
              <button className="px-4 py-2.5 bg-brown-warm hover:bg-brown-dark text-white font-semibold rounded-lg transition flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </Link>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <Package className="w-12 h-12 mx-auto text-brown-warm/30 mb-3" />
              <p className="text-brown-warm font-medium">No products found</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selectedProduct?.id === product.id}
                onSelect={() => setSelectedProduct(selectedProduct?.id === product.id ? null : product)}
                onDelete={handleDelete}
                onEdit={() => handleEdit(product)}
              />
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleRefresh}
        product={productToEdit}
      />
    </div>
  );
}

// Product Card Component
function ProductCard({ 
  product, 
  isSelected, 
  onSelect,
  onDelete,
  onEdit
}: { 
  product: Product; 
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (id: number, name: string) => void;
  onEdit: () => void;
}) {
  const finalPrice = product.sale > 0 
    ? product.price * (1 - product.sale / 100) 
    : product.price;

  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all duration-200 ${
      isSelected ? 'border-brown-warm shadow-md' : 'border-beige-medium hover:shadow-md'
    }`}>
      <div className="p-4 cursor-pointer" onClick={onSelect}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-beige-medium flex items-center justify-center overflow-hidden">
              {product?.image?.[0]?.url ? (
                <Image src={product?.image?.[0].url} alt={product.name} width={48} height={48} className="object-cover" />
              ) : (
                <Package className="w-6 h-6 text-brown-dark" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-brown-dark">{product.name}</h3>
              <p className="text-sm text-brown-warm">ID: #{product.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              {product.sale > 0 ? (
                <>
                  <p className="text-lg font-bold text-green-600">${finalPrice.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 line-through">${product.price}</p>
                </>
              ) : (
                <p className="text-lg font-bold text-brown-dark">${product.price}</p>
              )}
              <p className={`text-xs font-medium ${product.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>
                Stock: {product.stock}
              </p>
            </div>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Link href={`/shop/${product.id}`} target="_blank">
                <button className="p-2 text-brown-warm hover:text-brown-dark transition" title="View">
                  <Eye className="w-4 h-4" />
                </button>
              </Link>
              <button 
                onClick={onEdit}
                className="p-2 text-blue-500 hover:text-blue-700 transition" title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onDelete(product.id, product.name)}
                className="p-2 text-red-500 hover:text-red-700 transition" title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isSelected && (
        <div className="px-4 pb-4 pt-2 border-t border-beige-medium bg-beige-light/30 rounded-b-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-brown-dark flex items-center gap-2">
                <Package className="w-4 h-4" /> Product Details
              </h4>
              <div className="bg-white rounded-lg p-3 space-y-2 border border-beige-medium">
                <p className="text-brown-dark"><span className="font-semibold">Name:</span> {product.name}</p>
                <p className="text-brown-dark"><span className="font-semibold">Description:</span> {product.description?.substring(0, 100)}...</p>
                {product.colors && product.colors.length > 0 && (
                  <p className="text-brown-dark"><span className="font-semibold">Colors:</span> {product.colors.join(", ")}</p>
                )}
                {product.sizes && product.sizes.length > 0 && (
                  <p className="text-brown-dark"><span className="font-semibold">Sizes:</span> {product.sizes.join(", ")}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-brown-dark flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Quick Actions
              </h4>
              <div className="bg-white rounded-lg p-3 space-y-2 border border-beige-medium">
                <Link href={`/shop/${product.id}`} target="_blank">
                  <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-beige-medium hover:bg-beige-light text-brown-dark font-semibold rounded-lg text-sm transition">
                    <Eye className="w-4 h-4" />
                    View on Store
                  </button>
                </Link>
                <button
                  onClick={onEdit}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-brown-warm hover:bg-brown-dark text-white font-semibold rounded-lg text-sm transition"
                >
                  <Edit className="w-4 h-4" />
                  Edit Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}