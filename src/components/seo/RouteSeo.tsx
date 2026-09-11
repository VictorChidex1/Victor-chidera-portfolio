import PageSeo from "./PageSeo";
import { routes } from "../../seo/routes";

interface RouteSeoProps {
  path: string;
  jsonLd?: object | object[];
  noindex?: boolean;
}

// Convenience wrapper: pulls static title/description from the route map and
// delegates everything else to PageSeo.
const RouteSeo = ({ path, jsonLd, noindex }: RouteSeoProps) => {
  const meta = routes[path];
  if (!meta) {
    return <PageSeo path={path} jsonLd={jsonLd} noindex={noindex} />;
  }
  return (
    <PageSeo
      title={meta.title}
      description={meta.description}
      path={path}
      image={meta.image}
      jsonLd={jsonLd}
      noindex={noindex}
    />
  );
};

export default RouteSeo;
