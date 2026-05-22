import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  image?: string;
  patentCount?: number;
}

export default function ProductCard({ id, name, description, image, patentCount }: ProductCardProps) {
  return (
    <Link
      to={`/products/${id}`}
      className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
    >
      {image && (
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">{name}</h3>
          {patentCount !== undefined && (
            <div className="flex items-center space-x-2 text-secondary">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">{patentCount}</span>
            </div>
          )}
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
}
