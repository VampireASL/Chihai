import { Link } from 'react-router-dom';

interface NewsCardProps {
  id: string;
  title: string;
  date: string;
  summary: string;
  image?: string;
}

export default function NewsCard({ id, title, date, summary, image }: NewsCardProps) {
  return (
    <Link
      to={`/news/${id}`}
      className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex flex-col md:flex-row">
        {image && (
          <div className="md:w-1/2 relative overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
        <div className={`${image ? 'md:w-1/2' : 'w-full'} p-5 flex flex-col justify-between`}>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">{summary}</p>
          </div>
          <div className="pt-3">
            <span className="text-gray-400 text-sm">{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
