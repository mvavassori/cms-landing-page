import StrapiImage from "./StrapiImage";

interface FeatureSectionProps {
  data: {
    __component: string;
    id: number;
    featureCard: FeatureCard[];
  };
}

interface FeatureCard {
  id: number;
  title: string;
  description: string;
  media?: {
    url: string;
    alternativeText?: string;
  };
}

export default function FeatureSection({ data }: FeatureSectionProps) {
  const featureCards = data?.featureCard || [];
  return (
    <section
      className="container mx-auto grid md:grid-cols-2 gap-8 mb-16"
      id="features"
    >
      {featureCards.map((card) => (
        <div key={card.id} className="flex items-start gap-4">
          <div className="shrink-0 pt-1">
            {card.media?.url && (
              <StrapiImage
                width={64}
                height={64}
                src={card.media.url}
                alt={card.media.alternativeText || card.title}
                className="w-12 h-12 object-cover rounded"
              />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
            <p className="text-gray-600">{card.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
