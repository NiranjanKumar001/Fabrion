import { HelpCircleIcon, LogOut, Settings, Wallet2Icon } from "lucide-react";
import React, { useContext } from "react";
import { Button } from "../ui/button";
import { UserDetailContext } from "@/context/UserDetailContext";

function SideBarFooter() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext); 

  const handleSignOut = () => {
    // Clear user from context
    // setUserDetail(null);

    // Remove user from localStorage
    // localStorage.removeItem('user');

    window.location.href = '/';
  };

  const options = [
    { name: "Settings", icon: Settings },
    { name: "Help Center", icon: HelpCircleIcon },
    { name: "My Subscription", icon: Wallet2Icon },
    { name: "Sign out", icon: LogOut, action: handleSignOut },
  ];

  return (
    <div className="p-2 mb-10">
      {options.map((option, index) => (
        <Button
          key={index}
          variant="ghost"
          className="w-full flex space-x-3 "
          onClick={option.action}
        >
          <option.icon className="w-5 h-5" />
          <span className="text-left">{option.name}</span>
        </Button>
      ))}
    </div>
  );
}

export default SideBarFooter;
