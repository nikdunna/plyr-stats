"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session } = useSession();
  const sidebarItems = [
    {
      title: "Profile",
      url: "/profile",
    },
    {
      title: "Settings",
      url: "/profile/settings",
    },
  ];

  return (
    <div className="min-h-screen flex flex-row bg-gray-100 dark:bg-gray-900">
      {/* <div className="border border-black w-1/5 bg-blue-400">
                Sidebar goes here
            </div> */}
      <SidebarProvider className="w-1/5 min-h-screen">
        <Sidebar className="w-1/5 min-h-screen">
          <SidebarContent className="bg-blue-400">
            <SidebarMenu>
              <SidebarGroupLabel>PlyrStats</SidebarGroupLabel>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-blue-400 transition duration-300 ease-in hover:text-lg "
                  >
                    <Link href={item.url}>{item.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem key="logout">
                <SidebarMenuButton asChild>
                  <Button
                    onClick={() => console.log("implement logout function")}
                  >
                    Log Out
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>

      {/* content div */}
      <div className="flex flex-row items-center min-w-screen w-full justify-around">
        {/* profile info and charts */}
        <div className="h-[640px] w-[512px] flex flex-col justify-between">
          <div className="text-4xl">Your Stats</div>

          <Card className="bg-blue-400 rounded-lg w-full h-1/3">
            <CardContent className="flex flex-row rounded-lg w-full h-full">
              {/* profile picture */}
              <div className="flex items-center justify-center w-1/3">
                <Image
                  src={"/images/players/placeholder.jpg"}
                  alt="Avatar"
                  width={100}
                  height={100}
                />
              </div>

              {/* profile info */}
              <div className="w-2/3 flex flex-col justify-around">
                <div className="text-2xl text-white">Name</div>
                <div>
                  <div>email</div>
                  <div>DOB</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className=" rounded-lg h-1/2 flex items-center justify-center">
            <CardContent>
              <div>charts go here</div>
            </CardContent>
          </Card>
        </div>

        {/* recent activities */}
        <Card className="h-[640px] w-64">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              recent activites go here <br />
              TODO: create activites component to be wrapped by shadcn cards
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
