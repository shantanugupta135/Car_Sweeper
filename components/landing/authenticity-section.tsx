"use client"

import Image from "next/image"
import { CheckCircle2, MapPin, Users } from "lucide-react"

export function AuthenticitySection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance mb-4">
            Real Results. Real Homes. Real Trust.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Serving 100+ cars across Noida, Gurgaon, and Bangalore. See the transformation our professionals deliver every day.
          </p>
        </div>

        {/* Before/After Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Before/After Comparison */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">The Difference We Make</h3>
            <p className="text-muted-foreground leading-relaxed">
              Morning dust, pollution, and wear don't stand a chance. Our trained professionals use premium waterless techniques to restore your car's shine every single day.
            </p>
            
            {/* Before/After Images */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <div className="relative rounded-lg overflow-hidden border-2 border-muted">
                  <Image
                    src="/images/car-cleaning-before.png"
                    alt="Car before cleaning"
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-amber-500/90 text-white text-xs font-semibold rounded-full">
                    Before
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative rounded-lg overflow-hidden border-2 border-primary">
                  <Image
                    src="/images/car-cleaning-after.png"
                    alt="Car after cleaning"
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    After
                  </div>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3 mt-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Waterless Cleaning</p>
                  <p className="text-sm text-muted-foreground">Eco-friendly, scratch-free technology</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Daily Service</p>
                  <p className="text-sm text-muted-foreground">Every morning, rain or shine</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Photo Proof</p>
                  <p className="text-sm text-muted-foreground">Before/after photos on your phone</p>
                </div>
              </div>
            </div>
          </div>

          {/* Society Images Grid */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Serving Your Community</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Multiple Cars */}
              <div className="relative rounded-lg overflow-hidden border border-muted hover:border-primary/50 transition-colors">
                <Image
                  src="/images/multiple-cars-society.jpg"
                  alt="Multiple cars in society parking"
                  width={500}
                  height={300}
                  className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-semibold text-white">100+ Cars Trusted CarsGlow</p>
                  <p className="text-sm text-gray-200">Across multiple societies</p>
                </div>
              </div>

              {/* Society Locations */}
              <div className="grid grid-cols-3 gap-3">
                <div className="relative rounded-lg overflow-hidden border border-muted hover:border-primary/50 transition-colors h-40">
                  <Image
                    src="/images/society-noida.jpg"
                    alt="Noida apartment society"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors flex items-end p-3">
                    <div>
                      <p className="text-xs font-semibold text-white flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Noida
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-lg overflow-hidden border border-muted hover:border-primary/50 transition-colors h-40">
                  <Image
                    src="/images/society-gurgaon.jpg"
                    alt="Gurgaon apartment society"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors flex items-end p-3">
                    <div>
                      <p className="text-xs font-semibold text-white flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Gurgaon
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-lg overflow-hidden border border-muted hover:border-primary/50 transition-colors h-40">
                  <Image
                    src="/images/society-bangalore.jpg"
                    alt="Bangalore apartment society"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 hover:bg-black/30 transition-colors flex items-end p-3">
                    <div>
                      <p className="text-xs font-semibold text-white flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Bangalore
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {/* <div className="grid sm:grid-cols-3 gap-6 bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">100+</div>
            <p className="text-muted-foreground">Cars Cleaned Daily</p>
          </div>
          <div className="h-px sm:h-auto sm:border-l sm:border-border" />
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">50+</div>
            <p className="text-muted-foreground">Trained Professionals</p>
          </div>
          <div className="h-px sm:h-auto sm:border-l sm:border-border" />
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">4.9★</div>
            <p className="text-muted-foreground">Customer Rating</p>
          </div>
        </div> */}
      </div>
    </section>
  )
}
