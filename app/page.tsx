import qs from "qs";
import HeroSection from "@/components/HeroSection";
import HeaderSection from "@/components/HeaderSection";
import FeatureSection from "@/components/FeatureSection";

// Function to load data from Strapi
async function loader() {
  const path = "/api/home-page";
  const baseUrl = process.env.STRAPI_BASE_URL ?? "http://localhost:1337";
  
  const query = qs.stringify({
    populate: {
      homePageContent: {
        on: {
          'layout.hero-section': {
            populate: '*'
          },
          'layout.header-section': {
            populate: '*'
          },
          'layout.feature-section': {
              populate: {
                featureCard: {
                  populate: {
                    media: {
                      fields: ['url', 'alternativeText', 'name'], // Specify the fields for the media
                    }
                  }
                }
              }
            },
        }
      },
    },
  }, { encodeValuesOnly: true });

  const url = new URL(path, baseUrl);
  url.search = query; // Attach the query to the URL

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  try {
    const response = await fetch(url, {
      method: "GET",
      headers
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Strapi API Error:", errorBody);
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    return null;
  }
}

// Renderer for dynamic zone blocks
function renderBlock(block: any) {
  if (!block || !block.__component) {
    console.warn("Invalid block received:", block);
    return null;
  }

  const key = `${block.__component}-${block.id}`;

  switch (block.__component) {
    case "layout.hero-section":
      return <HeroSection key={key} data={block} />;
    case "layout.header-section":
      return <HeaderSection key={key} data={block} />;
    case "layout.feature-section":
      return <FeatureSection key={key} data={block} />;
    default:
      console.warn(`Unknown block type: ${block.__component}`);
      return null;
  }
}

export default async function Home() {
  const data = await loader();
  
  if (!data) {
    return (
      <div className="container mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-red-500">Failed to load content</h2>
      </div>
    );
  }

  const homePageContent = data.data?.homePageContent || [];

  // Render the dynamic content
  if (Array.isArray(homePageContent) && homePageContent.length > 0) {
    return (
      <>
        {homePageContent.map((block: any) => renderBlock(block))}
      </>
    );
  }

  // If we get here, we didn't find any content to render
  return (
    <div className="container mx-auto text-center py-20">
      <h2 className="text-2xl font-bold">No content found</h2>
      <p className="mt-4">
        Please check your Strapi configuration and ensure you have added content to your Home page.
      </p>
    </div>
  );
}