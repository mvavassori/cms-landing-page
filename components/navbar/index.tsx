import Link from "next/link";
import MobileMenu from "./MobileMenu";
import qs from "qs";
import StrapiImage from "../StrapiImage";
import { Button } from "../ui/button";

interface LinkItem {
  id: number;
  href: string;
  label: string;
  isExternal: boolean;
}

async function loader() {
  const path = "/api/global";
  const baseUrl = process.env.STRAPI_BASE_URL ?? "http://localhost:1337";

  const query = qs.stringify({
    populate: {
      navbar: {
        populate: {
          logoLink: {
            populate: {
              image: {
                fields: ["url", "alternativeText", "name"],
              },
            },
          },
          link: {
            populate: true,
          },
          cta: {
            populate: true,
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

const Navbar = async () => {
  const data = await loader();
  if (!data) return null;

  const logo = data.data.navbar.logoLink;
  const navigation: LinkItem[] = data.data.navbar.link;
  const cta: LinkItem = data.data.navbar.cta;

  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center justify-between lg:px-6 p-4 z-50 bg-white border-b-2 border-black">
      <div className="block flex-none md:hidden">
        <MobileMenu navigation={navigation} cta={cta} />
      </div>
      <div className="flex w-full items-center justify-center md:justify-normal">
        <Link href={logo.href || "/"} className="text-xl font-bold">
          <div className="flex items-center gap-x-2">
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

        <ul className="ml-12 hidden gap-6 text-sm md:flex md:items-center">
          {navigation?.map((link) => (
            <li key={link.id}>
              <Link
                href={link.href}
                className="underline-offset-4 hover:underline"
                target={link.isExternal ? "_blank" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end md:w-1/3">
        <Link href={cta.href} target={cta.isExternal ? "_blank" : undefined}>
          <Button>{cta.label}</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
