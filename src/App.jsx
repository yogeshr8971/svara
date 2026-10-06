import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import PlaygroundPage from './pages/PlaygroundPage';
import WardrobePage from './pages/WardrobePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import CreditsPage from './pages/CreditsPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthGuard from './components/auth/AuthGuard';
import AdminGuard from './components/auth/AdminGuard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
        <Route path="playground" element={<AuthGuard><PlaygroundPage /></AuthGuard>} />
        <Route path="wardrobe" element={<AuthGuard><WardrobePage /></AuthGuard>} />
        <Route path="cart" element={<AuthGuard><CartPage /></AuthGuard>} />
        <Route path="checkout" element={<AuthGuard><CheckoutPage /></AuthGuard>} />
        <Route path="orders" element={<AuthGuard><OrdersPage /></AuthGuard>} />
        <Route path="wishlist" element={<AuthGuard><WishlistPage /></AuthGuard>} />
        <Route path="credits" element={<AuthGuard><CreditsPage /></AuthGuard>} />
        <Route path="admin" element={<AdminGuard><AdminPage /></AdminGuard>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
