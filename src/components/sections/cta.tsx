import { Button } from '../ui/button';

export function CTA() {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-lg">
          {/* Decorative background elements */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-100/30 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-center gap-8 flex-col lg:flex-row">
              {/* Left aligned content */}
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Unlimited testing until you go live
                </h2>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span className="text-sm text-gray-600">1:1 Onboarding Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span className="text-sm text-gray-600">Amazon Compliance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <span className="text-sm text-gray-600">Questions? Call us: (512) 960-3042</span>
                  </div>
                </div>
              </div>

              {/* Right aligned form */}
              <div className="flex items-center gap-3 w-full lg:w-auto self-center">
                <input
                  type="email"
                  placeholder="ryan@mycompany.com"
                  className="flex-1 lg:w-[320px] px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 whitespace-nowrap">
                  Start Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}