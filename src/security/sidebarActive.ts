//Files: src/security/sidebarActive.ts

import type { SidebarMenuItem } from "@/security/roleMenuPolicy";

export function isMenuActive(item: SidebarMenuItem, pathname: string): boolean {
  if (item.path && pathname.startsWith(item.path)) {
    return true;
  }

  if (item.children && item.children.length > 0) {
    return item.children.some((child) => isMenuActive(child, pathname));
  }

  return false;
}
