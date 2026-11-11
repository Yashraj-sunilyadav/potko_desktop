import { Link } from "react-router-dom";
import type { ComponentProps } from "react";
export function RouterLink({ href, ...props }: Omit<ComponentProps<typeof Link>, "to"> & { href: string }) {
  return <Link to={href} {...props} />;
}
export default RouterLink;
