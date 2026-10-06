import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useDebounce } from '../hooks/useDebounce';
import * as productService from '../services/productService';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const debouncedSearch = useDebounce(searchQuery, 400);

  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [size, setSize] = useState(searchParams.get('size') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [page, setPage] = useState(1);

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat !== null) setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 12,
          sort,
          maxPrice,
        };
        if (category) params.category = category;
        if (size) params.size = size;
        if (debouncedSearch) params.search = debouncedSearch;

        const res = await productService.getProducts(params);
        setProducts(res.products || []);
        setTotal(res.total || 0);
      } catch (err) {
        console.error('Error fetching catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [category, size, sort, maxPrice, debouncedSearch, page]);

  const handleClearFilters = () => {
    setCategory('');
    setSize('');
    setSort('newest');
    setMaxPrice(10000);
    setSearchQuery('');
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-champagne-500">Collection</span>
          <h1 className="section-heading text-3xl font-bold">Women's Wardrobe</h1>
          <p className="text-xs text-charcoal-400 mt-1">Showing {total} curated designer pieces</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-full md:w-80">
            <Input
              icon={Search}
              placeholder="Search dresses, kurtas, jackets..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden p-3 rounded-xl glass text-charcoal-600 hover:bg-white"
            aria-label="Toggle Filters"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden md:block md:col-span-1 sticky top-28">
          <ProductFilters
            selectedCategory={category}
            onSelectCategory={(cat) => {
              setCategory(cat);
              setSearchParams(cat ? { category: cat } : {});
              setPage(1);
            }}
            selectedSize={size}
            onSelectSize={(s) => {
              setSize(s);
              setPage(1);
            }}
            selectedSort={sort}
            onSelectSort={(srt) => {
              setSort(srt);
              setPage(1);
            }}
            priceRange={maxPrice}
            onPriceChange={(p) => {
              setMaxPrice(p);
              setPage(1);
            }}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Mobile Filters Drawer */}
        {mobileFilterOpen && (
          <div className="md:hidden col-span-1">
            <ProductFilters
              selectedCategory={category}
              onSelectCategory={(cat) => {
                setCategory(cat);
                setSearchParams(cat ? { category: cat } : {});
                setPage(1);
                setMobileFilterOpen(false);
              }}
              selectedSize={size}
              onSelectSize={(s) => {
                setSize(s);
                setPage(1);
                setMobileFilterOpen(false);
              }}
              selectedSort={sort}
              onSelectSort={(srt) => {
                setSort(srt);
                setPage(1);
                setMobileFilterOpen(false);
              }}
              priceRange={maxPrice}
              onPriceChange={(p) => {
                setMaxPrice(p);
                setPage(1);
              }}
              onClearFilters={handleClearFilters}
            />
          </div>
        )}

        {/* Products Grid */}
        <div className="col-span-1 md:col-span-3 space-y-8">
          <ProductGrid products={products} loading={loading} />

          {/* Pagination Controls */}
          {total > 12 && (
            <div className="flex justify-center items-center gap-3 pt-6 border-t border-ivory-300/40">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-xs text-charcoal-500 font-semibold px-2">Page {page}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={page * 12 >= total}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
