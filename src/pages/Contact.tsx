import ContactForm from '@/components/ContactForm';
import { contactInfo } from '@/data/mockData';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const contactMethods = [
  {
    icon: MapPin,
    title: '公司地址',
    content: contactInfo.address,
  },
  {
    icon: Phone,
    title: '联系电话',
    content: contactInfo.phone,
  },
  {
    icon: Mail,
    title: '电子邮箱',
    content: contactInfo.email,
  },
  {
    icon: Clock,
    title: '工作时间',
    content: contactInfo.workingHours,
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary font-medium">联系我们</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              与我们取得联系
            </h1>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              有任何问题或合作意向？请随时与我们联系
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactMethods.map((item) => (
                  <div
                    key={item.title}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <item.icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.content}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-primary/5 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-4">地图</h3>
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>地图加载中...</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
