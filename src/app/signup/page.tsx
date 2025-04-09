"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nanoid } from "nanoid";
        
export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    role: "",
    teamCode: "",
    jerseyNumber: "",
    heightFeet: "",
    heightInches: "",
    height: 0,
    playerCode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
      // Clear role-specific fields when role changes
      teamCode: "",
      jerseyNumber: "",
      heightFeet: "",
      heightInches: "",
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.role) newErrors.role = "Role is required";

    // Role-specific validation
    if (formData.role === "PLAYER") {
      if (!formData.teamCode) newErrors.teamCode = "Team code is required";
      if (
        formData.jerseyNumber &&
        (isNaN(Number(formData.jerseyNumber)) ||
          Number(formData.jerseyNumber) < 0)
      ) {
        newErrors.jerseyNumber = "Jersey number must be a positive number";
      }
      if (
        formData.heightFeet &&
        (isNaN(Number(formData.heightFeet)) ||
          Number(formData.heightFeet) < 0 ||
          Number(formData.heightFeet) > 8)
      ) {
        newErrors.heightFeet = "Height (feet) must be between 0 and 8";
      }
      if (
        formData.heightInches &&
        (isNaN(Number(formData.heightInches)) ||
          Number(formData.heightInches) < 0 ||
          Number(formData.heightInches) > 11)
      ) {
        newErrors.heightInches = "Height (inches) must be between 0 and 11";
      }
    }

    if (formData.role === "PARENT") {
      if (!formData.playerCode)
        newErrors.playerCode = "Player code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { confirmPassword, heightFeet, heightInches, ...parsedFormData } =
      formData;

    // Calculate total height in inches if provided
    if (heightFeet && heightInches) {
      parsedFormData.height = Number(heightFeet) * 12 + Number(heightInches);
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(parsedFormData),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors((prev) => ({ ...prev, submit: data.error }));
      } else {
        router.push("/login");
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: "An error occurred during signup",
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <Image
                src="/images/logos/plyrstats.png"
                alt="PlyrStats Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create an account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join PlyrStats today
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="role"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Role
                </label>
                <Select onValueChange={handleRoleChange} value={formData.role}>
                  <SelectTrigger
                    className={`w-full ${errors.role ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLAYER">Player</SelectItem>
                    <SelectItem value="COACH">Coach</SelectItem>
                    <SelectItem value="PARENT">Parent</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role}</p>
                )}
              </div>

              {formData.role === "PLAYER" && (
                <>
                  <div className="space-y-2">
                    <label
                      htmlFor="teamCode"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Team Code
                    </label>
                    <Input
                      id="teamCode"
                      name="teamCode"
                      type="text"
                      placeholder="Enter your team code"
                      value={formData.teamCode}
                      onChange={handleChange}
                      className={errors.teamCode ? "border-red-500" : ""}
                    />
                    {errors.teamCode && (
                      <p className="text-sm text-red-500">{errors.teamCode}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="jerseyNumber"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Jersey Number (Optional)
                    </label>
                    <Input
                      id="jerseyNumber"
                      name="jerseyNumber"
                      type="number"
                      min="0"
                      placeholder="Enter jersey number"
                      value={formData.jerseyNumber}
                      onChange={handleChange}
                      className={errors.jerseyNumber ? "border-red-500" : ""}
                    />
                    {errors.jerseyNumber && (
                      <p className="text-sm text-red-500">
                        {errors.jerseyNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="heightFeet"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Height (Feet) (Optional)
                      </label>
                      <Input
                        id="heightFeet"
                        name="heightFeet"
                        type="number"
                        min="0"
                        max="8"
                        placeholder="Feet"
                        value={formData.heightFeet}
                        onChange={handleChange}
                        className={errors.heightFeet ? "border-red-500" : ""}
                      />
                      {errors.heightFeet && (
                        <p className="text-sm text-red-500">
                          {errors.heightFeet}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="heightInches"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Height (Inches) (Optional)
                      </label>
                      <Input
                        id="heightInches"
                        name="heightInches"
                        type="number"
                        min="0"
                        max="11"
                        placeholder="Inches"
                        value={formData.heightInches}
                        onChange={handleChange}
                        className={errors.heightInches ? "border-red-500" : ""}
                      />
                      {errors.heightInches && (
                        <p className="text-sm text-red-500">
                          {errors.heightInches}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {formData.role === "PARENT" && (
                <div className="space-y-2">
                  <label
                    htmlFor="playerCode"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Player Code
                  </label>
                  <Input
                    id="playerCode"
                    name="playerCode"
                    type="text"
                    placeholder="Enter your player's code"
                    value={formData.playerCode}
                    onChange={handleChange}
                    required
                  />
                  {errors.playerCode && (
                    <p className="text-sm text-red-500">{errors.playerCode}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {errors.submit && (
                <p className="text-sm text-red-500 text-center">
                  {errors.submit}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
