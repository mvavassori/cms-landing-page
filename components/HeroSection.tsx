import Link from "next/link";
import StrapiImage from "@/components/StrapiImage";
import { Button } from "@/components/ui/button";

interface CtaItem {
  id: number;
  href: string;
  label: string;
  isExternal: boolean;
}

interface HeroSectionProps {
  data: {
    __component: string;
    id: number;
    title?: string;
    subtitle?: string;
    image?: {
      id: number;
      documentId: string;
      name: string;
      alternativeText: string | null;
      caption: string | null;
      width: number;
      height: number;
      formats: {
        thumbnail: any;
        large: any;
        medium: any;
        small: any;
      };
      hash: string;
      ext: string;
      mime: string;
      size: number;
      url: string;
      previewUrl: string | null;
      provider: string;
      provider_metadata: any | null;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    };
    cta?: CtaItem[];
  };
}

export default function HeroSection({ data }: HeroSectionProps) {
  // Handle potential Strapi response format variations
  const title = data?.title || '';
  const subtitle = data?.subtitle || '';
  
  // Use image data directly from the response
  const imageData = data?.image;
  const imageUrl = imageData?.url || '';
  
  // Get CTA items directly
  const ctaItems = data?.cta || [];

  return (
    <section className="min-h-[600px]">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 min-h-[600px] gap-8 items-center">
          {/* Content side */}
          <div className="py-12 flex flex-col justify-center order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-800">
              {title}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-zinc-600">
              {subtitle}
            </p>

            {/* CTA Buttons */}
            {ctaItems && ctaItems.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {ctaItems.map((ctaItem) => (
                  <Button key={ctaItem.id} asChild>
                    <Link href={ctaItem.href} target={ctaItem.isExternal ? '_blank' : '_self'}>
                      {ctaItem?.label || 'Learn More'}
                    </Link>
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          {/* Image side */}
          <div className="relative h-full min-h-[400px] order-1 md:order-2">
            {imageUrl && (
              <div className="relative h-full rounded-lg overflow-hidden shadow-xl">
                <StrapiImage 
                  src={imageUrl} 
                  alt={imageData?.alternativeText || 'Hero image'} 
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}