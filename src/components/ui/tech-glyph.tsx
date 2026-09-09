import type { SVGProps } from "react";
import {
  BootstrapIcon,
  Css3Icon,
  GitIcon,
  GithubIcon as GithubBrand,
  Html5Icon,
  JavaScriptIcon,
  NodeJsIcon,
  PythonIcon,
  ReactIcon,
  RestApiIcon,
  SqlIcon,
  TailwindIcon,
  TypeScriptIcon,
  VercelIcon,
  WordpressIcon,
} from "./tech-icons";

const registry: Record<string, (p: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  react: ReactIcon,
  typescript: TypeScriptIcon,
  javascript: JavaScriptIcon,
  node: NodeJsIcon,
  html: Html5Icon,
  css: Css3Icon,
  git: GitIcon,
  github: GithubBrand,
  sql: SqlIcon,
  rest: RestApiIcon,
  bootstrap: BootstrapIcon,
  wordpress: WordpressIcon,
  python: PythonIcon,
  tailwind: TailwindIcon,
  vercel: VercelIcon,
};

export function TechGlyph({
  icon,
  ...props
}: SVGProps<SVGSVGElement> & { icon: string }) {
  const Icon = registry[icon];
  return Icon ? <Icon {...props} /> : null;
}
