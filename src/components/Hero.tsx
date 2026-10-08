import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  bgImage?: string;
}

export default function Hero({
  title = '创新驱动未来',
  subtitle = '赤海智能装备 - 引领行业变革，创造卓越价值',
  description = '专业从事自动化设备的研发、设计、制造及电阻焊设备制造，引进日本欧美先进技术，积累二十多年丰富经验',
  ctaText = '了解更多',
  bgImage,
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      {bgImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${bgImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/50" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center px-4 py-2 bg-secondary/20 rounded-full mb-6 animate-fade-in">
          <span className="w-2 h-2 bg-secondary rounded-full mr-2 animate-pulse" />
          <span className="text-secondary text-sm font-medium">创新科技，引领未来</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          {title}
          <br />
          <span className="text-secondary">{subtitle}</span>
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/about"
            className="px-8 py-4 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary/90 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            {ctaText}
          </Link>
          <Link
            to="/products"
            className="px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
          >
            浏览产品
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#features" className="text-white/60 hover:text-white transition-colors">
          <ChevronDown className="w-8 h-8" />
        </a>
      </div>
    </section>
  );
}
