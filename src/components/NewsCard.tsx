interface NewsCardProps {
  id: number;
  title: string;
  date: string;
  category: string;
  summary: string;
  image: string;
}

export default function NewsCard({ title, date, category, summary, image }: NewsCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
              {category}
            </span>
          </div>
        </div>
        <div className="md:w-1/2 p-5 flex flex-col justify-between">
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
    </div>
  );
}
