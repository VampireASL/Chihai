import { Lightbulb, Shield, Users, Award } from 'lucide-react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb,
  Shield,
  Users,
  Award,
};

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const IconComponent = iconMap[icon];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
        {IconComponent && <IconComponent className="w-7 h-7 text-primary group-hover:text-secondary transition-colors" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
