import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Eye } from 'lucide-react';
import Button from '../components/ui/Button';
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/product/ProductSkeleton';
import * as productService from '../services/productService';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLooks = async () => {
      try {
        setLoading(true);
        const [featRes, trendRes] = await Promise.all([
          productService.getProducts({ featured: 'true', limit: 4 }),
          productService.getProducts({ trending: 'true', limit: 4 }),
        ]);
        setFeaturedProducts(featRes.products || []);
        setTrendingProducts(trendRes.products || []);
      } catch (err) {
        console.error('Error fetching home collections:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLooks();
  }, []);

  return (
    <div className="space-y-24">
      {/* 1. Hero Section */}
      <section className="relative -mt-24 min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 scale-105 transform filter brightness-90"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=85')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-800/80 via-charcoal-800/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 mt-12">
          <div className="max-w-2xl text-white space-y-6">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-dark text-champagne-300 text-xs font-semibold tracking-widest uppercase"
            >
              <Sparkles size={13} className="fill-champagne-300" />
              Next-Generation AI Try-On
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight"
            >
              Wear Your Voice
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-ivory-200 text-sm sm:text-base md:text-lg leading-relaxed font-light"
            >
              Discover fashion that feels like you. Explore curated luxury looks and see how they drape on your silhouette with instant AI-powered virtual try-on.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link to="/shop">
                <Button variant="secondary" size="lg" className="shadow-elegant">
                  <span>Explore Collection</span>
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/playground">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                  <Sparkles size={16} />
                  <span>Try Your Look</span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. New Arrivals (Featured) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-champagne-500">Curated Edit</span>
            <h2 className="section-heading text-2xl sm:text-3xl lg:text-4xl mt-1">New Arrivals</h2>
          </div>
          <Link to="/shop" className="text-xs uppercase font-semibold text-charcoal-500 hover:text-champagne-500 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 3. AI Virtual Try-On Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-charcoal-700 overflow-hidden text-white p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl border border-charcoal-600">
          <div className="max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-champagne-400">
              <Sparkles size={14} />
              AI Visualizer
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              See It On You Before You Buy
            </h2>
            <p className="text-charcoal-300 text-sm leading-relaxed font-light">
              Skip the fitting room guesswork. Upload a single standing photo, choose any outfit from our designer wardrobe, and watch the AI tailor a hyper-realistic preview in seconds.
            </p>
            <div className="pt-2">
              <Link to="/playground">
                <Button variant="secondary" size="md">
                  <span>Enter Virtual Try-On Studio</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative w-full max-w-xs aspect-[3/4] rounded-2xl overflow-hidden glass border border-white/20 shadow-glass-lg shrink-0">
            <img
              src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80"
              alt="Virtual Try On Model"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-3 bottom-3 glass-dark p-3 rounded-xl flex items-center justify-between text-xs">
              <span className="font-medium text-champagne-200">Evening Drape Preview</span>
              <span className="text-[10px] text-emerald-400 font-bold">100% Match</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trending Styles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-champagne-500">Most Desired</span>
            <h2 className="section-heading text-2xl sm:text-3xl lg:text-4xl mt-1">Trending Looks</h2>
          </div>
          <Link to="/shop?sort=popular" className="text-xs uppercase font-semibold text-charcoal-500 hover:text-champagne-500 flex items-center gap-1">
            <span>Explore Trends</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {trendingProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 5. How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-champagne-500">The SVARA Experience</span>
          <h2 className="section-heading text-2xl sm:text-3xl mt-1">Effortless In 4 Steps</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Create Avatar', desc: 'Upload a clear full-body standing photo validated by our AI vision model.' },
            { step: '02', title: 'Pick Your Outfit', desc: 'Browse handcrafted dresses, co-ords, ethnic sets, and designer jackets.' },
            { step: '03', title: 'AI Virtual Try-On', desc: 'Preview lighting, drape, and silhouette realism in the virtual studio.' },
            { step: '04', title: 'Order With Confidence', desc: 'Save to personal wardrobe and check out securely with fast doorstep delivery.' },
          ].map((item) => (
            <div key={item.step} className="glass rounded-3xl p-6 relative flex flex-col justify-between">
              <span className="font-display text-4xl font-extrabold text-champagne-300 block mb-4">
                {item.step}
              </span>
              <div>
                <h3 className="font-display text-base font-bold text-charcoal-700 mb-2">{item.title}</h3>
                <p className="text-xs text-charcoal-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Editorial Testimonial / Brand Philosophy */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-widest text-champagne-500">Our Voice</span>
        <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl text-charcoal-700 italic leading-snug">
          "Fashion is not about fitting into clothes. It is about clothes that celebrate who you are."
        </blockquote>
        <p className="text-xs uppercase tracking-widest font-semibold text-charcoal-400">
          The SVARA Design Atelier
        </p>
      </section>
    </div>
  );
}
