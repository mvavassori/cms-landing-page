import qs from "qs";

async function loader() {
  // const path = "/api/home";
  // const baseUrl = process.env.STRAPI_BASE_URL ?? "http://localhost:1337";
  // const query = qs.stringify({
  //   populate: {
  //     navbar: {
  //       populate: {
  //         logoLink: {
  //           populate: {
  //             image: {
  //               fields: ["url", "alternativeText", "name"],
  //             },
  //           },
  //         },
  //         link: {
  //           populate: true,
  //         },
  //         cta: {
  //           populate: true,
  //         },
  //       },
  //     },
  //   },
  // });
  // const url = new URL(path, baseUrl);
  // url.search = query;
  // const headers = new Headers();
  // headers.append("Content-Type", "application/json");
  // try {
  //   const response = await fetch(url, {
  //     method: "GET",
  //     headers,
  //   });
  //   if (!response.ok) {
  //     const errorBody = await response.text();
  //     console.error(errorBody);
  //     throw new Error(`Response status: ${response.status}`);
  //   }
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error(error);
  // }
}

export default function Home() {
  return;
}
