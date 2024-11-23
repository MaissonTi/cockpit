import Link from "next/link";
import { ComponentProps } from "react";
import { usePathname } from "next/navigation";

export type NavLinkProps = ComponentProps<typeof Link>;

export function NavLink(props: NavLinkProps) {
  const pathname = usePathname();

  // return (
  //   <Link
  //     {...props}
  //     data-current={pathname === props.to}
  //     className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[current=true]:text-foreground"
  //   />
  // )

  return (
    <Link
      {...props}
      className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[current=true]:text-foreground"
    />
  );
}
