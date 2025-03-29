import {
  Sidebar,
  SidebarContent,
  SidebarFooter,//ui
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { Button } from "../ui/button"
import { MessageCircleCode } from "lucide-react"
import WorkspaceHistory from "./WorkspaceHistory"
import SideBarFooter from "./SidebarFooter"

export function AppSidebar() {
  return (
    <Sidebar className='no-scrollbar'>
      <SidebarHeader className="p-5">
        <Image src={'/logo.png'} alt='logo' width={30} height={30} />
      <Button className='mt-5'><MessageCircleCode />Start New Chat</Button>
      </SidebarHeader>
      <SidebarContent className='p-5 no-scrollbar'>
        <SidebarGroup />
        <SidebarGroup>
          <WorkspaceHistory />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SideBarFooter/>
        {/* component */}
      </SidebarFooter>
    </Sidebar>
  )
}
