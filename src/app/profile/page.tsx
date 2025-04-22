
"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session } = useSession();
  console.log("Session data:", session);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    confirmEmail: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password change functionality
    setIsEditingPassword(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email change functionality
    setIsEditingEmail(false);
    setEmailForm({
      newEmail: "",
      confirmEmail: "",
    });
  };

  const convertHeightToFeetAndInches = (inches: number) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}'${remainingInches}"`;
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-900 dark:text-white">
          Please{" "}
          <Link className="text-blue-500" href="/login">
            sign in
          </Link>{" "}
          to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Image
              src="/images/players/placeholder.jpeg"
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {session.user.fullName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {session.user.role}
          </p>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {session.user.fullName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {session.user.email}
                </p>
              </div>
              {session.user.jerseyNumber !== -1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Jersey Number
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {session.user.jerseyNumber}
                  </p>
                </div>
              )}
              {session.user.position && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Position
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {session.user.position}
                  </p>
                </div>
              )}
              {session.user.height && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Height
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {convertHeightToFeetAndInches(session.user.height)}
                  </p>
                </div>
              )}
              {session.user.playerCode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Player Code
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {session.user.playerCode}
                  </p>
                </div>
              )}
              {session.user.role === "COACH" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Team Code
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {session.user.teamCode}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditingPassword ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="currentPassword"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Current Password
                  </label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    New Password
                  </label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirm New Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingPassword(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            ) : (
              <Button onClick={() => setIsEditingPassword(true)}>
                Change Password
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Change Email */}
        <Card>
          <CardHeader>
            <CardTitle>Change Email</CardTitle>
            <CardDescription>Update your email address</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditingEmail ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="newEmail"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    New Email
                  </label>
                  <Input
                    id="newEmail"
                    name="newEmail"
                    type="email"
                    value={emailForm.newEmail}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="confirmEmail"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirm New Email
                  </label>
                  <Input
                    id="confirmEmail"
                    name="confirmEmail"
                    type="email"
                    value={emailForm.confirmEmail}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingEmail(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update Email</Button>
                </div>
              </form>
            ) : (
              <Button onClick={() => setIsEditingEmail(true)}>
                Change Email
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
