export function echoesHead(title: string, description: string) {
  return { meta: [{ title: `${title} | VIRSA Echoes` }, { name: "description", content: description },
    { property: "og:title", content: `${title} | VIRSA Echoes` }, { property: "og:description", content: description },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] };
}