import React from "react";
import Link from "next/link";
import qs from "qs";
import StrapiImage from "./StrapiImage";

interface LinkItem {
  id: number;
  href: string;
  label: string;
  isExternal: boolean;
}

interface LinkFamily {
  id: number;
  family: string;
  link: LinkItem[];
}

async function loader() {
  const path = "/api/global";
  const baseUrl = process.env.STRAPI_BASE_URL ?? "http://localhost:1337";

  const query = qs.stringify({
    populate: {
      footer: {
        populate: {
          logoLink: {
            populate: {
              image: {
                fields: ["url", "alternativeText", "name"],
              },
            },
          },
          linkFamily: {
            populate: {
              link: {
                populate: true,
              },
            },
          },
        },
      },
    },
  });

  const url = new URL(path, baseUrl);
  url.search = query;

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
    console.error(error);
  }
}

export default async function Footer() {
  const data = await loader();
  if (!data) return null;

  const logo = data.data.footer.logoLink;
  const linkFamilies: LinkFamily[] = data.data.footer.linkFamily;

  return (
    <footer className="border-t mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href={logo.href || "/"} className="text-lg font-bold">
              <div className="flex items-center gap-2">
                <span>
                  <StrapiImage
                    src={logo.image.url}
                    width={32}
                    height={32}
                    alt={logo.image.alternativeText || logo.image.name}
                  />
                </span>
                <span className="text-zinc-700">{logo.label}</span>
              </div>
            </Link>
            <p className="text-sm text-zinc-600 mt-4">
              Your beatiful landing page for a successful launch
            </p>
          </div>

          {/* Product Column */}
          {linkFamilies.map((linkFamily) => (
            <div key={linkFamily.id}>
              <h4 className="font-semibold mb-4">{linkFamily.family}</h4>
              <ul className="space-y-2 text-sm">
                {linkFamily.link.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="text-zinc-600 hover:text-zinc-900"
                      target={link.isExternal ? "_blank" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Bottom Bar */}
        </div>
        <div className="border-t mt-8 pt-8 text-sm text-zinc-600">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} LandingPage</p>
            <p>Made in Europe 🇪🇺</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
