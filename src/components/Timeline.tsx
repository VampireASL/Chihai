import { timeline } from '@/data/mockData';

export default function Timeline() {
  return (
    <div className="relative">
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gray-200" />
      
      <div className="space-y-8">
        {timeline.map((item, index) => (
          <div
            key={item.year}
            className={`relative flex flex-col md:flex-row ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-secondary font-bold text-2xl">{item.year}</span>
                <h3 className="text-lg font-semibold text-gray-800 mt-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{item.description}</p>
              </div>
            </div>
            
            <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-secondary rounded-full border-4 border-white shadow-md" />
            </div>
            
            <div className="md:w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
