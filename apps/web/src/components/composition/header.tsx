"use client";

import { Home, Dock, Users } from "lucide-react";

import { DarkMode } from "./dark-mode";
import { Separator } from "@radix-ui/react-separator";
import { NavLink } from "./nav-link";
import { AccountMenu } from "./account-menu";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <Dock className="h-6 w-6" />

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink href="/">
            <Home className="h-4 w-4" />
            Início
          </NavLink>
          <NavLink href="/users">
            <Users className="h-4 w-4" />
            Users
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center space-x-2">
          <DarkMode />
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
