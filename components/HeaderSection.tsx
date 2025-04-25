import React from "react";

interface HeaderSectionProps {
  data: {
    __component: string;
    id: number;
    title?: string;
    subtitle?: string;
    description?: string;
  };
}

export default function HeaderSection({ data }: HeaderSectionProps) {
  const title = data?.title || "";
  const subtitle = data?.subtitle || "";
  const description = data?.description || "";

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto">
        <div className="">
          {/* Gradient background with content */}
          <div className="relative rounded-2xl overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-blue-950 opacity-90"></div>
            
            {/* Content */}
            <div className="relative z-10 p-8 md:p-12 text-white">
              {subtitle && (
                <p className="text-lg md:text-xl font-medium mb-3">
                  {subtitle}
                </p>
              )}
              
              {title && (
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  {title}
                </h2>
              )}
              
              {description && (
                <div className="text-base md:text-lg leading-relaxed">
                  <p>{description}</p>
                </div>
              )}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}