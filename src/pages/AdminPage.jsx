import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, Sparkles, TrendingUp, Plus, Trash2 } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import StatCard from '../components/admin/StatCard';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { formatPrice } from '../utils/formatPrice';
import { formatDate } from '../utils/formatDate';
import * as adminService from '../services/adminService';
import * as productService from '../services/productService';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [vtoLogs, setVtoLogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal for new product
  const [newProductModal, setNewProductModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: 20,
    sizes: 'XS, S, M, L, XL',
  });
  const [prodImages, setProdImages] = useState([]);
  const [tryOnImage, setTryOnImage] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, usersRes, prodsRes, vtoRes, catsRes] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers(),
          productService.getProducts({ limit: 50 }),
          adminService.getVtoGenerations(),
          adminService.getCategories(),
        ]);
        setStats(statsRes.stats);
        setUsers(usersRes.users || []);
        setProducts(prodsRes.products || []);
        setVtoLogs(vtoRes.generations || []);
        setCategories(catsRes.categories || []);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      toast.success(`User role set to ${newRole}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update role');
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(prodId);
      setProducts((prev) => prev.filter((p) => p._id !== prodId));
      toast.success('Product deleted.');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', newProduct.price);
      formData.append('category', newProduct.category || categories[0]?._id);
      formData.append('description', newProduct.description);
      formData.append('stock', newProduct.stock);
      formData.append('sizes', JSON.stringify(newProduct.sizes.split(',').map((s) => s.trim())));

      for (let i = 0; i < prodImages.length; i++) {
        formData.append('images', prodImages[i]);
      }
      if (tryOnImage) {
        formData.append('tryOnImage', tryOnImage);
      }
      if (newProduct.imageUrl) {
        formData.append('imageUrl', newProduct.imageUrl);
      }
      if (newProduct.tryOnImageUrl) {
        formData.append('tryOnImageUrl', newProduct.tryOnImageUrl);
      }

      const res = await productService.createProduct(formData);
      setProducts([res.product, ...products]);
      toast.success('Product added successfully!');
      setNewProductModal(false);
      setNewProduct({ name: '', price: '', category: '', description: '', stock: 20, sizes: 'XS, S, M, L, XL', imageUrl: '', tryOnImageUrl: '' });
      setProdImages([]);
      setTryOnImage(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-burgundy-500">Privileged Area</span>
        <h1 className="section-heading text-3xl font-bold">SVARA Atelier Admin</h1>
        <p className="text-xs text-charcoal-400 mt-1">Platform management, AI operations, and inventory controls</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1">
          <AdminSidebar activeSection={activeSection} onSelectSection={setActiveSection} />
        </div>

        {/* Content View */}
        <div className="md:col-span-3 space-y-8">
          {loading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              {/* Section 1: Dashboard Overview */}
              {activeSection === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Total Platform Revenue" value={formatPrice(stats?.totalRevenue || 0)} icon={TrendingUp} />
                    <StatCard title="Registered Customers" value={stats?.users || 0} icon={Users} />
                    <StatCard title="Active Catalog Styles" value={stats?.products || 0} icon={Package} />
                    <StatCard title="Orders Placed" value={stats?.orders || 0} icon={ShoppingBag} />
                    <StatCard title="Virtual Try-Ons Completed" value={stats?.vtoGenerations || 0} icon={Sparkles} />
                  </div>
                </div>
              )}

              {/* Section 2: Products */}
              {activeSection === 'products' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold text-charcoal-700">Catalog Inventory</h3>
                    <Button variant="primary" size="sm" onClick={() => setNewProductModal(true)}>
                      <Plus size={14} />
                      <span>Add New Product</span>
                    </Button>
                  </div>

                  <div className="glass rounded-3xl overflow-hidden border border-white/60">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-charcoal-600">
                        <thead className="bg-white/40 uppercase tracking-wider text-[10px] text-charcoal-400 border-b border-ivory-300/40">
                          <tr>
                            <th className="p-4">Look</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-ivory-200/40">
                          {products.map((p) => (
                            <tr key={p._id} className="hover:bg-white/30">
                              <td className="p-4 flex items-center gap-3">
                                <img src={p.images?.[0]?.url} alt="" className="w-10 h-12 object-cover rounded-lg bg-ivory-200" />
                                <span className="font-semibold text-charcoal-700">{p.name}</span>
                              </td>
                              <td className="p-4">{p.category?.name || 'Standard'}</td>
                              <td className="p-4 font-bold text-charcoal-700">{formatPrice(p.price)}</td>
                              <td className="p-4">{p.stock} units</td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => handleDeleteProduct(p._id)}
                                  className="p-1.5 rounded-lg text-burgundy-500 hover:bg-rose-50"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 3: Users */}
              {activeSection === 'users' && (
                <div className="space-y-6">
                  <h3 className="font-display text-xl font-bold text-charcoal-700">Platform Accounts</h3>
                  <div className="glass rounded-3xl overflow-hidden border border-white/60">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-charcoal-600">
                        <thead className="bg-white/40 uppercase tracking-wider text-[10px] text-charcoal-400 border-b border-ivory-300/40">
                          <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">AI Credits</th>
                            <th className="p-4 text-right">Permissions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-ivory-200/40">
                          {users.map((u) => (
                            <tr key={u._id} className="hover:bg-white/30">
                              <td className="p-4 font-semibold text-charcoal-700">{u.name}</td>
                              <td className="p-4 text-charcoal-400">{u.email}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-burgundy-100 text-burgundy-600' : 'bg-ivory-200 text-charcoal-500'}`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="p-4 font-mono font-bold text-champagne-600">{u.credits}</td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => handleRoleToggle(u._id, u.role)}
                                  className="text-xs text-champagne-600 hover:text-champagne-700 font-semibold underline"
                                >
                                  Make {u.role === 'admin' ? 'User' : 'Admin'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 4: VTO Logs */}
              {activeSection === 'vto' && (
                <div className="space-y-6">
                  <h3 className="font-display text-xl font-bold text-charcoal-700">Virtual Try-On Audit Log</h3>
                  <div className="glass rounded-3xl overflow-hidden border border-white/60">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-charcoal-600">
                        <thead className="bg-white/40 uppercase tracking-wider text-[10px] text-charcoal-400 border-b border-ivory-300/40">
                          <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Product</th>
                            <th className="p-4">Provider</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-ivory-200/40">
                          {vtoLogs.map((gen) => (
                            <tr key={gen._id} className="hover:bg-white/30">
                              <td className="p-4 font-semibold text-charcoal-700">{gen.userId?.name || 'Customer'}</td>
                              <td className="p-4">{gen.productId?.name || 'Outfit'}</td>
                              <td className="p-4 uppercase text-[10px] font-bold text-charcoal-400">{gen.provider}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${gen.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                  {gen.status}
                                </span>
                              </td>
                              <td className="p-4 text-charcoal-400">{formatDate(gen.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={newProductModal} onClose={() => setNewProductModal(false)} title="Upload Product Design">
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <Input
            label="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price (INR)"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              required
            />
            <Input
              label="Initial Stock"
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="text-xs uppercase font-medium text-charcoal-400 mb-1 block">Category</label>
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="input-field py-2 text-xs"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Sizes (Comma separated)"
            value={newProduct.sizes}
            onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
          />

          <div className="space-y-2">
            <label className="text-xs uppercase font-medium text-charcoal-400 block">Product Images</label>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setProdImages(Array.from(e.target.files))}
              className="text-xs w-full mb-1"
            />
            <Input
              placeholder="Or paste image URL (e.g. https://images.unsplash.com/...)"
              value={newProduct.imageUrl || ''}
              onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase font-medium text-charcoal-400 block">Try-On Garment Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setTryOnImage(e.target.files[0])}
              className="text-xs w-full mb-1"
            />
            <Input
              placeholder="Or paste clean garment URL for AI Try-On"
              value={newProduct.tryOnImageUrl || ''}
              onChange={(e) => setNewProduct({ ...newProduct, tryOnImageUrl: e.target.value })}
            />
          </div>

          <Button type="submit" variant="primary" loading={creating} className="w-full justify-center mt-2">
            Publish Product
          </Button>
        </form>
      </Modal>
    </div>
  );
}
