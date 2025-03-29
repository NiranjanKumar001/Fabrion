import { HelpCircleIcon, icons, LogOut, Settings, Wallet2Icon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

function SideBarFooter() {
  const options = [
    {
      name: "Settings",
      icon: Settings,
    },
    {
      name: "Help Center",
      icon: HelpCircleIcon,
    },
    {
      name: "My Subscription",
      icon: Wallet2Icon,
    },
    {
      name: "Sign out",
      icon: LogOut,
    },
  ];
  return (
  <div>
    {options.map((option,index)=>(
        <Button>
            <option.icon/>
            {option.name}
        </Button>
    ))}
  </div>
  )
}

export default SideBarFooter;
