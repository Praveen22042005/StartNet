"use client";
import React, { useState, useEffect } from "react";
import InvestorSidebar from "@/app/sidebar/investor/page";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Startup } from "@/types/startup";
import { API_ROUTES } from "@/config/api";
import { useRouter } from "next/navigation";
import {
  RocketIcon,
  PersonIcon,
  // Removed: ChartIcon
} from "@radix-ui/react-icons";
import { FaDollarSign, FaChartBar } from "react-icons/fa"; // Use FaChartBar for chart icon
import { toast } from "react-hot-toast";
import Image from "next/image";

const InvestorHomePage = () => {
  const [loading, setLoading] = useState(true);
  const [recentStartups, setRecentStartups] = useState<Startup[]>([]);
  const [stats, setStats] = useState({
    totalInvestments: 0,
    activeStartups: 0,
    totalInvested: 0,
    averageReturn: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_ROUTES.INVESTOR.STARTUPS.GET_ALL}?limit=3`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setRecentStartups(data.startups);

        // Example stats; replace these with real API values if available.
        setStats({
          totalInvestments: 12,
          activeStartups: 8,
          totalInvested: 500000,
          averageReturn: 15,
        });
      } catch (error) {
        toast.error(`Failed to fetch dashboard data: ${(error as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <InvestorSidebar>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
        </div>
      </InvestorSidebar>
    );
  }

  return (
    <InvestorSidebar>
      <div className="container mx-auto p-4 md:p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Track your investments and discover new opportunities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <PersonIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Investments
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.totalInvestments}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <RocketIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Active Startups
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.activeStartups}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <FaDollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Invested
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    ${stats.totalInvested.toLocaleString()}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <FaChartBar className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg. Return</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.averageReturn}%
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Startups Section */}
        <Card className="bg-white mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Recently Added Startups
            </CardTitle>
            <CardDescription>
              Latest opportunities for investment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentStartups.map((startup) => (
                <div
                  key={startup._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                      {startup.startupLogo ? (
                        <div className="relative h-10 w-10">
                          <Image
                            src={startup.startupLogo}
                            alt={startup.startupName}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-gray-400">
                          {startup.startupName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {startup.startupName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {startup.industry}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${startup.fundingGoal.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Funding Goal</p>
                  </div>
                </div>
              ))}
              <Button
                onClick={() => router.push("/investor/startups")}
                className="w-full mt-4 bg-gray-900 text-white hover:bg-gray-800"
              >
                View All Startups
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </InvestorSidebar>
  );
};

export default InvestorHomePage;