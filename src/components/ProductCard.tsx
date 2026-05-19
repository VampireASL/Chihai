import { FileText } from 'lucide-react';

interface ProductCardProps {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  patentCount: number;
}

export default function ProductCard({ name, category, description, image, patentCount }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-secondary text-primary text-xs font-medium rounded-full">
            {category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <div className="flex items-center space-x-1 text-secondary">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">{patentCount}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
