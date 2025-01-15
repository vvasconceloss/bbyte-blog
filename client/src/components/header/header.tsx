import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

export const Header = () => {
  return (
    <header className="flex items-center justify-between p-3">
      <h1 className="text-2xl font-bold">BByte Blog</h1>
      <NavigationMenu>
        <NavigationMenuList className="space-x-5">
          <NavigationMenuItem className="cursor-pointer">
            <NavigationMenuLink>
              Recent
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="cursor-pointer">
            <NavigationMenuLink>
              Relevant
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="cursor-pointer">
            <NavigationMenuLink>
              About
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="space-x-2">
        <button className="w-[4.5rem] p-2 rounded-md text-sm bg-zinc-900 text-white">Login</button>
        <button className="w-[4.5rem] p-2 rounded-md text-sm bg-zinc-900 text-white">Register</button>
      </div>
    </header>
  )
}