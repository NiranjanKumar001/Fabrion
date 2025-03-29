import { HelpCircleIcon, LogOut, Settings, Wallet2Icon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

function SideBarFooter() {
  const options = [
    { name: "Settings", icon: Settings },
    { name: "Help Center", icon: HelpCircleIcon },
    { name: "My Subscription", icon: Wallet2Icon },
    { name: "Sign out", icon: LogOut },
  ];

  return (
    <div className="p-2 mb-10">
      {options.map((option, index) => (
        <Button
          key={index}
          variant="ghost"
          className="w-full flex space-x-3 "
        >
          <option.icon className="w-5 h-5" /> {/* Ensure icon renders properly */}
          <span className="text-left">{option.name}</span>
        </Button>
      ))}
    </div>
  );
}

export default SideBarFooter;
