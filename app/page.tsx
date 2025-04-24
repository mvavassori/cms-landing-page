import Link from "next/link";
import qs from "qs";
import StrapiImage from "@/components/StrapiImage";
import { Button } from "@/components/ui/button";

interface CtaItem {
  id: number;
  href: string;
  label: string;
  isExternal: boolean;
}

async function loader() {
  const path = "/api/home";
  const baseUrl = process.env.STRAPI_BASE_URL ?? "http://localhost:1337";
  
  // Structure the query parameters using qs.stringify
  const query = qs.stringify({
    populate: {
      hero: {
        // This will populate the hero section (title, subtitle, image, etc.)
        populate: {
          cta: true, // Populate the CTA component
          image: {
            fields: ["url", "alternativeText", "name"],
          },
        },
      },
      header: true, // Populate the header section (title, subtitle, description)
      features: {
        // Populate the features section
        populate: {
          featureCard: true, // Populate each feature card inside the features section
        },
      },
    },
  }, { encodeValuesOnly: true }); // Ensure values are encoded properly

  const url = new URL(path, baseUrl);
  url.search = query; // Attach the query to the URL

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(errorBody);
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching home data:", error);
  }
}


export default async function Home() {
  const data = await loader();
  if (!data) return null;

  console.log(data)
  const hero = data.data.hero; // Extract the hero data from the response
  const { title, subtitle, image } = hero; // Destructure title, subtitle, cta, and image

  const cta: CtaItem[] = data.data.hero.cta

  console.log("cta",cta)

  const backgroundImageUrl = image && image.url ? image.url : ''; // Get the image URL (assuming it's in your Strapi's image field)

  // Render Hero Section with Tailwind
  return (
    <div className="relative text-white py-20 px-4 sm:px-6 lg:px-8">
      {/* Next.js Image for the Background */}
      {backgroundImageUrl && (
        <div className="absolute inset-0 z-0">
          <StrapiImage
            src={backgroundImageUrl}
            alt={image.alternativeText}
            width={1920}
            height={1080}
            className="object-cover w-full h-full" // Ensure it covers the section properly
            priority
          />
        </div>
      )}

      {/* Content on top of the background image */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-xl sm:text-2xl">{subtitle}</p>

        {/* Check if there is a CTA */}
        {cta && cta.length > 0 && (
          <div className="mt-8 space-y-4"> {/* Add space between CTAs */}
            {cta.map((ctaItem, index) => (
              <Link href={ctaItem.href} target={ctaItem.isExternal ? "_blank" : undefined} key={index}>
                <Button size={"lg"}>{ctaItem.label}</Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
