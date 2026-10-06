import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <span className="text-xs uppercase font-bold tracking-widest text-champagne-500">404 Exception</span>
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-charcoal-700">Look Not Found</h1>
      <p className="text-xs text-charcoal-400 max-w-sm leading-relaxed">
        The design or page you requested could not be located in our current catalog.
      </p>
      <Link to="/">
        <Button variant="primary" size="md" className="mt-2">
          <ArrowLeft size={16} />
          <span>Return to SVARA Atelier</span>
        </Button>
      </Link>
    </div>
  );
}
