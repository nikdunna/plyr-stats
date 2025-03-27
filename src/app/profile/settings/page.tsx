"use client"

import { Sidebar, SidebarContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-select"
export default function ProfileSettingsPage() {
    const sidebarItems = [
        {
            title: "Profile",
            url: "/profile",
        },
        {
            title: "Settings",
            url: "/profile/settings"
        }
    ]
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Update Profile");
    }
    return (
        <div className="min-h-screen flex flex-row bg-gray-100">
            <SidebarProvider className="w-1/5 min-h-screen" >
                <Sidebar className="w-1/5 min-h-screen">
                    <SidebarContent className="bg-blue-400">
                       <SidebarMenu>
                        <SidebarGroupLabel>PlyrStats</SidebarGroupLabel>
                        {sidebarItems.map(item => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild className="hover:bg-blue-400 transition duration-300 ease-in hover:text-lg ">
                                    <Link href={item.url}>{item.title}</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                        <SidebarMenuItem key="logout">
                            <SidebarMenuButton asChild>
                                <Button onClick={() => console.log('implement logout function')}>Log Out</Button>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                       </SidebarMenu>
                    </SidebarContent>
                </Sidebar>
            </SidebarProvider>

            <div className="w-4/5 min-h-screen">
                <div className="w-full h-12 text-4xl">Settings</div>
                <div className="flex items-center justify-center w-full min-h-screen">
                    {/* settings form wrapped in shadcn card component */}
                    <Card className="w-full min-h-96">
                        {/* idea: use flex and grid, 2x2 grid for what is shown in the figma  */}
                        <CardContent className="h-full">
                            <form onSubmit={handleSubmit} className="h-72">
                                <div className=" text-4xl">Account Information</div>
                                <div className="grid grid-cols-2 grid-rows-2 h-5/6">
                                    <div className="">
                                        <div className="h-1/4 w-full">Profile Picture</div>
                                        <div className="flex flex-row items-center justify-around h-3/4 w-full">
                                            <div className=" w-1/2 h-1/2 border border-black">picture here</div>
                                            <Button className="bg-white text-black hover:bg-white hover:shadow-lg">Change</Button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-around">
                                        <div className="flex flex-row items-center justify-between w-5/6">
                                            <label htmlFor="email">Email</label>
                                            <Input type="text" id="email" className="w-3/4 bg-gray-300"/>
                                        </div>
                                        <div className="flex flex-row items-center justify-between w-5/6">
                                            <label htmlFor="password">Password</label>
                                            <Input type="password" id="password" className="w-3/4 bg-gray-300" />                                        
                                        </div>                                        
                                    </div>
                                    <div className="flex flex-col items-center justify-around">
                                        <div className="flex flex-row items-center justify-around w-full">
                                            <label htmlFor="firstname">First Name</label>
                                            <Input type="text" id="firstname" className="w-1/2 bg-gray-300"/>
                                        </div>
                                        
                                        <div className="flex flex-row items-center justify-around w-full">
                                            <label htmlFor="lastname">Last Name</label>
                                            <Input type="text" id="lastname" className="w-1/2 bg-gray-300"/>                                        
                                        </div>
                                        
                                    </div>
                                    <div className="flex flex-col items-center justify-around">
                                        <div className="flex flex-row items-center justify-between w-5/6 ">
                                            <label htmlFor="darkmode">Dark Mode</label>
                                            <Input type="checkbox" id="darkmode" className="w-8 h-8" />
                                        </div>
                                        <div className="flex flex-row items-center justify-between w-5/6 ">
                                            <label htmlFor="notifications">Enable email notifications</label>    
                                            <Input type="checkbox" id="notifications" className="w-8 h-8"/>    
                                        </div>
                                        
                                        
                                        
                                    </div>    
                                </div>
                                <div className="h-1/6 w-full flex items-center justify-center">
                                    <Button onClick={() => console.log("Implement profile updating functionality")}>Save changes</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}