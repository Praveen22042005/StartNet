"use client";
import React, { useState, useEffect } from 'react';
import EntrepreneurSidebar from '@/app/sidebar/entrepreneur/page';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Startup } from '@/types/startup';
import { startupApi } from '@/config/api';
import { PlusIcon, RocketIcon, PersonIcon, CheckCircledIcon, CrossCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const EntrepreneurHomePage = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const data = await startupApi.fetchStartups();
        setStartups(data);
      } catch (error) {
        toast.error('Failed to fetch startups');
      } finally {
        setLoading(false);
      }
    };
    fetchStartups();
  }, []);

  const getProfileCompletionPercentage = () => {
    // Add logic to calculate profile completion
    return 75; // Placeholder value
  };

  if (loading) {
    return (
      <EntrepreneurSidebar>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800" />
        </div>
      </EntrepreneurSidebar>
    );
  }

  return (
    <EntrepreneurSidebar>
      <div className="container mx-auto p-4 md:p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your startups</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Startups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <RocketIcon className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="text-2xl font-bold text-gray-900">{startups.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Funding Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">
                  ${startups.reduce((sum, startup) => sum + startup.fundingGoal, 0).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Raised</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-green-600">
                  ${startups.reduce((sum, startup) => sum + startup.raisedSoFar, 0).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <PersonIcon className="h-5 w-5 text-indigo-600 mr-2" />
                  <span className="text-2xl font-bold text-gray-900">{getProfileCompletionPercentage()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${getProfileCompletionPercentage()}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Startups and Tasks Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Startups */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Recent Startups</CardTitle>
              <CardDescription>Your latest startup ventures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {startups.slice(0, 3).map((startup) => (
                  <div key={startup._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {startup.startupLogo ? (
                        <img
                          src={startup.startupLogo}
                          alt={startup.startupName}
                          className="h-10 w-10 rounded-lg object-contain bg-white"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-400">
                            {startup.startupName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{startup.startupName}</h3>
                        <p className="text-sm text-gray-500">{startup.industry}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${startup.raisedSoFar.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">of ${startup.fundingGoal.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => router.push('/entrepreneur/startups')}
                  variant="outline"
                  className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  View All Startups
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tasks and Suggestions */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Action Items</CardTitle>
              <CardDescription>Things that need your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {startups.some(s => !s.startupLogo) && (
                  <div className="flex items-center space-x-3 p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                    <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Missing Startup Logos</p>
                      <p className="text-xs mt-1">Add logos to increase visibility and brand recognition</p>
                    </div>
                  </div>
                )}
                
                {startups.some(s => !s.description || s.description.length < 100) && (
                  <div className="flex items-center space-x-3 p-3 bg-red-50 text-red-800 rounded-lg border border-red-200">
                    <CrossCircledIcon className="h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Incomplete Descriptions</p>
                      <p className="text-xs mt-1">Detailed descriptions help investors understand your vision better</p>
                    </div>
                  </div>
                )}

                {startups.some(s => !s.website) && (
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
                    <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Missing Website Links</p>
                      <p className="text-xs mt-1">Add website links to showcase your online presence</p>
                    </div>
                  </div>
                )}

                {startups.length === 0 && (
                  <div className="flex items-center space-x-3 p-3 bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-200">
                    <RocketIcon className="h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Start Your Journey</p>
                      <p className="text-xs mt-1">Create your first startup to begin fundraising</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3 p-3 bg-green-50 text-green-800 rounded-lg border border-green-200">
                  <CheckCircledIcon className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Profile Status</p>
                    <p className="text-xs mt-1">Your profile is {getProfileCompletionPercentage()}% complete</p>
                  </div>
                </div>

                <Button
                  onClick={() => router.push('/entrepreneur/startups')}
                  className="w-full mt-4 bg-gray-900 text-white hover:bg-gray-800"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips and Resources */}
        <Card className="bg-white mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Quick Tips & Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Perfect Your Pitch</h3>
                <p className="text-sm text-gray-600">Learn how to create a compelling pitch deck that attracts investors.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Network Growth</h3>
                <p className="text-sm text-gray-600">Connect with other entrepreneurs and potential investors.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Funding Strategies</h3>
                <p className="text-sm text-gray-600">Explore different funding options for your startup.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </EntrepreneurSidebar>
  );
};

export default EntrepreneurHomePage;