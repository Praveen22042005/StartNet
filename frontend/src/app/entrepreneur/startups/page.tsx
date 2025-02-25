"use client";
import React, { useState, useEffect } from 'react';
import EntrepreneurSidebar from '@/app/sidebar/entrepreneur/page';
import { startupApi, API_ROUTES } from '@/config/api';
import { Startup, TeamMember } from '@/types/startup';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, Pencil1Icon, EyeOpenIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

interface ApiError {
  message: string;
}

interface ExtendedStartup {
  founded: number;
  problem: string;
  solution: string;
  traction: string;
  targetMarket: string;
  tam: string;
  demand: string;
  scalability: string;
  competitors: string;
  advantage: string;
  revenueStreams: string;
  annualRevenue: number;
  projectedRevenue: string;
  previousFunding: string;
  seeking: string;
  investorROI: string;
  equityAvailable: string;
}

const StartupsPage = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingStartup, setIsAddingStartup] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [formData, setFormData] = useState<Startup & Partial<ExtendedStartup>>({
    startupName: '',
    industry: '',
    fundingGoal: 0,
    raisedSoFar: 0,
    description: '',
    startupLogo: '', // Will store the uploaded logo URL
    website: '',
    address: '',
    email: '',
    mobile: '',
    team: [{ name: '', role: '', email: '', linkedIn: '' }],
    founded: 2023,
    problem: '',
    solution: '',
    traction: '',
    targetMarket: '',
    tam: '',
    demand: '',
    scalability: '',
    competitors: '',
    advantage: '',
    revenueStreams: '',
    annualRevenue: 0,
    projectedRevenue: '',
    previousFunding: '',
    seeking: '',
    investorROI: '',
    equityAvailable: ''
  });

  const [charCounts, setCharCounts] = useState({
    description: 0,
    problem: 0,
    solution: 0,
    traction: 0,
    competitors: 0,
    advantage: 0,
    revenueStreams: 0
  });

  const router = useRouter();

  useEffect(() => {
    const fetchStartupsData = async () => {
      try {
        setLoading(true);
        const fetchedStartups = await startupApi.fetchStartups();
        setStartups(fetchedStartups);
      } catch (error) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || 'Failed to fetch your startups';
        setError(errorMessage);
        toast.error(errorMessage);
        
        // If the error is due to authentication, redirect to login
        if (errorMessage.includes('Authentication required')) {
          router.push('/auth/signin');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStartupsData();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, type } = e.target;
    const updatedValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: updatedValue
    }));
    
    // Update character count for textarea fields
    if (type !== 'number') {
      setCharCounts(prev => ({
        ...prev,
        [name]: value.length
      }));
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
  
    try {
      console.log("Uploading logo, file:", file);
      console.log("Attempting upload to:", API_ROUTES.STARTUPS.UPLOAD_LOGO);
      
      // Remove Content-Type header as it will be set automatically for FormData
      const res = await fetch(API_ROUTES.STARTUPS.UPLOAD_LOGO, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataUpload
      });
      
      console.log("Upload response status:", res.status);
      const responseText = await res.text();
      console.log("Response text:", responseText);
  
      try {
        const data = JSON.parse(responseText);
        if (res.ok) {
          setFormData(prev => ({
            ...prev,
            startupLogo: data.logoUrl
          }));
          toast.success("Logo uploaded successfully");
        } else {
          toast.error(data.message || "Logo upload failed");
        }
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        toast.error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Logo upload failed");
    }
  };

  const handleTeamChange = (
    index: number, 
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    const newTeam = [...formData.team];
    
    newTeam[index] = {
      ...newTeam[index],
      [name]: value
    };

    setFormData(prev => ({
      ...prev,
      team: newTeam
    }));
  };

  const addTeamMember = (): void => {
    const newMember: TeamMember = {
      name: '',
      role: '',
      email: '',
      linkedIn: ''
    };

    setFormData(prev => ({
      ...prev,
      team: [...prev.team, newMember]
    }));
  };

  const removeTeamMember = (index: number): void => {
    if (formData.team.length <= 1) {
      toast.error('At least one team member is required');
      return;
    }

    setFormData(prev => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index)
    }));
  };

  const handleAddStartupClick = () => {
    setIsAddingStartup(true);
    setFormData({
      startupName: '',
      industry: '',
      fundingGoal: 0,
      raisedSoFar: 0,
      description: '',
      startupLogo: '',
      website: '',
      address: '',
      email: '',
      mobile: '',
      team: [{ name: '', role: '', email: '', linkedIn: '' }],
      founded: 2023,
      problem: '',
      solution: '',
      traction: '',
      targetMarket: '',
      tam: '',
      demand: '',
      scalability: '',
      competitors: '',
      advantage: '',
      revenueStreams: '',
      annualRevenue: 0,
      projectedRevenue: '',
      previousFunding: '',
      seeking: '',
      investorROI: '',
      equityAvailable: ''
    });
  };

  const handleEditStartupClick = (startup: Startup) => {
    router.push(`/entrepreneur/startups/edit/${startup._id}`);
  };

  const handleViewDetailsClick = (startup: Startup) => {
    router.push(`/entrepreneur/startups/${startup._id}`);
  };

  const handleCancelClick = () => {
    setIsAddingStartup(false);
    setSelectedStartup(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!formData.startupName || !formData.industry || !formData.description) {
        toast.error('Please fill in all required fields');
        return;
      }
  
      if (formData.fundingGoal <= 0) {
        toast.error('Funding goal must be greater than 0');
        return;
      }
  
      if (!formData.team || formData.team.length === 0 || !formData.team[0].name) {
        toast.error('At least one team member is required');
        return;
      }
  
      if (selectedStartup?._id) {
        await startupApi.updateStartup(selectedStartup._id, formData);
        toast.success('Startup updated successfully');
      } else {
        await startupApi.createStartup(formData);
        toast.success('Startup created successfully');
      }
      
      setIsAddingStartup(false);
      setSelectedStartup(null);
      const fetchedStartups = await startupApi.fetchStartups();
      setStartups(fetchedStartups);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      const message = error instanceof Error ? error.message : 'Failed to save startup';
      setError(message);
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <EntrepreneurSidebar>
        <div className="container mx-auto p-4 md:p-8 bg-gray-50">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Startups</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="bg-white shadow-lg">
                <CardHeader className="bg-gray-50 border-b p-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </EntrepreneurSidebar>
    );
  }

  return (
    <EntrepreneurSidebar>
      <div className="container mx-auto p-4 md:p-8 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Startups</h1>

        {!isAddingStartup ? (
          <div>
            {startups.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">No startups added yet. Click the button below to add your first startup!</p>
                <Button onClick={handleAddStartupClick} variant="outline" className="hover:bg-indigo-50 text-black">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Startup
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {startups.map((startup) => (
                  <Card key={startup._id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <CardHeader className="bg-gray-50 border-b p-4">
                      <div className="flex items-center space-x-4">
                        {startup.startupLogo ? (
                          <img 
                            src={startup.startupLogo} 
                            alt={`${startup.startupName} logo`} 
                            className="h-12 w-12 object-contain rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-400">
                              {startup.startupName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-xl text-gray-800">{startup.startupName}</CardTitle>
                          <p className="text-sm text-gray-600">{startup.industry}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Funding Goal</p>
                            <p className="text-lg font-semibold text-gray-900">
                              ${startup.fundingGoal.toLocaleString()}
                            </p>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-sm font-medium text-gray-500">Raised</p>
                            <p className="text-lg font-semibold text-green-600">
                              ${startup.raisedSoFar.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min((startup.raisedSoFar / startup.fundingGoal) * 100, 100)}%` 
                            }}
                          />
                        </div>

                        <div className="pt-2 space-y-2">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {startup.description}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex items-center text-gray-600">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="truncate">{startup.email}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{startup.mobile}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center text-gray-600">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                <a 
                                  href={startup.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-indigo-600 hover:text-indigo-800 truncate"
                                >
                                  Website
                                </a>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="truncate">{startup.address}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 flex justify-between items-center">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => handleEditStartupClick(startup)} 
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            <Pencil1Icon className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button 
                              variant="default" 
                              size="sm" 
                              onClick={() => handleViewDetailsClick(startup)}
                              className="bg-gray-900 text-white hover:bg-gray-800"
                              >
                              <EyeOpenIcon className="mr-2 h-4 w-4" />
                                  View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="flex items-center justify-center">
                  <Button 
                    onClick={handleAddStartupClick} 
                    variant="outline" 
                    className="w-full h-full min-h-[200px] border-2 border-dashed border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 text-black"
                  >
                    <PlusIcon className="mr-2 h-6 w-6" />
                    Add Startup
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card className="mb-8 bg-white shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-gray-800">{selectedStartup ? 'Edit Startup' : 'Add Startup'}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Startup Name
      </label>
      <input
        type="text"
        name="startupName"
        value={formData.startupName}
        onChange={handleChange}
        required
        maxLength={100}
        placeholder="FinTech Boost"
    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
  />
  <div className="flex justify-end">
    <span className={`text-xs ${charCounts.startupName > 90 ? 'text-amber-600' : 'text-gray-500'}`}>
      {charCounts.startupName}/100 characters
    </span>
  </div>
</div>
                  
                  <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Industry
  </label>
  <input
    type="text"
    name="industry"
    value={formData.industry}
    onChange={handleChange}
    required
    maxLength={50}
    placeholder="FinTech"
    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
  />
  <div className="flex justify-end">
    <span className={`text-xs ${charCounts.industry > 45 ? 'text-amber-600' : 'text-gray-500'}`}>
      {charCounts.industry}/50 characters
    </span>
  </div>
</div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Funding Goal $</label>
                    <input
                      type="number"
                      name="fundingGoal"
                      value={formData.fundingGoal}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="500000"
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Raised So Far $</label>
                    <input
                      type="number"
                      name="raisedSoFar"
                      value={formData.raisedSoFar}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="250000"
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Startup Logo Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Startup Logo</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="mt-1 block w-full"
                    />
                    {formData.startupLogo && (
                      <img src={formData.startupLogo} alt="Startup Logo" className="mt-2 h-12" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://fintechboost.com"
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Address
  </label>
  <input
    type="text"
    name="address"
    value={formData.address}
    onChange={handleChange}
    required
    maxLength={100}
    placeholder="123 Main Street, New York, NY"
    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
  />
  <div className="flex justify-end">
    <span className={`text-xs ${charCounts.address > 90 ? 'text-amber-600' : 'text-gray-500'}`}>
      {charCounts.address}/100 characters
    </span>
  </div>
</div>

                  <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">Description</label>
  <textarea
    name="description"
    value={formData.description}
    onChange={handleChange}
    rows={4}
    maxLength={500}
    placeholder="AI-powered risk assessment for faster loan approvals to SMEs"
    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900"
  />
  <div className="flex justify-end">
    <span className={`text-xs ${charCounts.description > 450 ? 'text-amber-600' : 'text-gray-500'}`}>
      {charCounts.description}/500 characters
    </span>
  </div>
</div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="info@fintechboost.com"
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Mobile</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      placeholder="+1 (555) 123-4567"
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <Card className="mt-8 bg-white shadow">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-gray-800">Team Members</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {formData.team.map((member, index) => (
                      <Card key={index} className="mb-4 bg-white shadow">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Name</label>
                              <input
                                type="text"
                                name="name"
                                value={member.name}
                                onChange={(e) => handleTeamChange(index, e)}
                                placeholder="John Doe"
                                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Role</label>
                              <input
                                type="text"
                                name="role"
                                value={member.role}
                                onChange={(e) => handleTeamChange(index, e)}
                                placeholder="CEO"
                                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">Email</label>
                              <input
                                type="email"
                                name="email"
                                value={member.email}
                                onChange={(e) => handleTeamChange(index, e)}
                                placeholder="john.doe@fintechboost.com"
                                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                              <input
                                type="url"
                                name="linkedIn"
                                value={member.linkedIn}
                                onChange={(e) => handleTeamChange(index, e)}
                                placeholder="https://linkedin.com/in/johndoe"
                                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                          {formData.team.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTeamMember(index)}
                              className="mt-4 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
                            >
                              Remove Member
                            </button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200 flex items-center"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Team Member
                    </button>
                  </CardContent>
                </Card>

                <Card className="mt-8 bg-white shadow">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-gray-800">
                      Additional Startup Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* 1️⃣ Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Founded (Year)
                        </label>
                        <input
                          type="number"
                          name="founded"
                          value={formData.founded ?? ''}
                          onChange={handleChange}
                          placeholder="2023"
                          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                        />
                      </div>
                    </div>

                    {/* 2️⃣ Idea & Validation */}
                    <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Problem
  </label>
  <textarea
    name="problem"
    value={formData.problem ?? ''}
    onChange={handleChange}
    rows={3}
    maxLength={300}
    placeholder="60% of SMEs struggle with obtaining quick loans..."
    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
  />
  <div className="flex justify-end">
    <span className={`text-xs ${charCounts.problem > 270 ? 'text-amber-600' : 'text-gray-500'}`}>
      {charCounts.problem}/300 characters
    </span>
  </div>
</div>
                    <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Solution
  </label>
  <textarea
    name="solution"
    value={formData.solution ?? ''}
    onChange={handleChange}
    rows={3}
    maxLength={300}
    placeholder="AI-powered risk assessment for faster approvals..."
    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
  />
  <div className="flex justify-end">
    <span className={`text-xs ${charCounts.solution > 270 ? 'text-amber-600' : 'text-gray-500'}`}>
      {charCounts.solution}/300 characters
    </span>
  </div>
</div>
                    <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Traction
  </label>
  <textarea
    name="traction"
    value={formData.traction ?? ''}
    onChange={handleChange}
    rows={3}
    maxLength={250}
    placeholder="500+ businesses onboarded, $50K revenue in 3 months..."
    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
  />
  <div className="flex justify-end">
    <span className={`text-xs ${charCounts.traction > 225 ? 'text-amber-600' : 'text-gray-500'}`}>
      {charCounts.traction}/250 characters
    </span>
  </div>
</div>

                    {/* 3️⃣ Market & Growth */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Target Market
                        </label>
                        <input
                          type="text"
                          name="targetMarket"
                          value={formData.targetMarket ?? ''}
                          onChange={handleChange}
                          placeholder="SMEs"
                          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          TAM (Total Addressable Market)
                        </label>
                        <input
                          type="text"
                          name="tam"
                          value={formData.tam ?? ''}
                          onChange={handleChange}
                          placeholder="$10B"
                          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Demand
                        </label>
                        <input
                          type="text"
                          name="demand"
                          value={formData.demand ?? ''}
                          onChange={handleChange}
                          placeholder="70% of SMEs seek alternative lending..."
                          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Scalability
                        </label>
                        <input
                          type="text"
                          name="scalability"
                          value={formData.scalability ?? ''}
                          onChange={handleChange}
                          placeholder="Expansion into Europe & Asia..."
                          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                        />
                      </div>
                    </div>

                    {/* 4️⃣ Competitors & Edge */}
                    <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Competitors
  </label>
  <textarea
    name="competitors"
    value={formData.competitors ?? ''}
    onChange={handleChange}
    rows={2}
    maxLength={150}
    placeholder="Kabbage, Lendio, OnDeck..."
    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
  />
  <div className="flex justify-end">
    <span className={`text-xs ${charCounts.competitors > 135 ? 'text-amber-600' : 'text-gray-500'}`}>
      {charCounts.competitors}/150 characters
    </span>
  </div>
</div>
                    <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Advantage
  </label>
  <textarea
    name="advantage"
    value={formData.advantage ?? ''}
    onChange={handleChange}
    rows={2}
    maxLength={150}
    placeholder="AI-based approvals, lower interest rates, 24-hour processing..."
    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
  />
  <div className="flex justify-end">
    <span className={`text-xs ${charCounts.advantage > 135 ? 'text-amber-600' : 'text-gray-500'}`}>
      {charCounts.advantage}/150 characters
    </span>
  </div>
</div>

                    {/* 5️⃣ Revenue & Financials */}
                    <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Revenue Streams
  </label>
  <textarea
    name="revenueStreams"
    value={formData.revenueStreams ?? ''}
    onChange={handleChange}
    rows={2}
    maxLength={200}
    placeholder="2% transaction fee, $10/month credit monitoring..."
    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
  />
  <div className="flex justify-end">
    <span className={`text-xs ${charCounts.revenueStreams > 180 ? 'text-amber-600' : 'text-gray-500'}`}>
      {charCounts.revenueStreams}/200 characters
    </span>
  </div>
</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Annual Revenue
                        </label>
                        <input
                          type="number"
                          name="annualRevenue"
                          value={formData.annualRevenue ?? 0}
                          onChange={handleChange}
                          placeholder="150000 (for $150K)"
                          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                        />
                      </div>
                      <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Projected Revenue
  </label>
  <input
    type="text"
    name="projectedRevenue"
    value={formData.projectedRevenue ?? ''}
    onChange={handleChange}
    maxLength={100}
    placeholder="1M+"
    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
  />
  <div className="flex justify-end">
    <span className={`text-xs ${charCounts.projectedRevenue > 90 ? 'text-amber-600' : 'text-gray-500'}`}>
      {charCounts.projectedRevenue}/100 characters
    </span>
  </div>
</div>
                    </div>

                    {/* 6️⃣ Funding & Investment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Previous Funding
  </label>
  <input
    type="text"
    name="previousFunding"
    value={formData.previousFunding ?? ''}
    onChange={handleChange}
    maxLength={100}
    placeholder="$250K Seed"
    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
  />
  <div className="flex justify-end">
    <span className={`text-xs ${charCounts.previousFunding > 90 ? 'text-amber-600' : 'text-gray-500'}`}>
      {charCounts.previousFunding}/100 characters
    </span>
  </div>
</div>
                      <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Seeking
  </label>
  <input
    type="text"
    name="seeking"
    value={formData.seeking ?? ''}
    onChange={handleChange}
    maxLength={100}
    placeholder="$500K for AI scaling & user growth..."
    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
  />
  <div className="flex justify-end">
    <span className={`text-xs ${charCounts.seeking > 90 ? 'text-amber-600' : 'text-gray-500'}`}>
      {charCounts.seeking}/100 characters
    </span>
  </div>
</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Investor ROI
  </label>
  <input
    type="text"
    name="investorROI"
    value={formData.investorROI ?? ''}
    onChange={handleChange}
    maxLength={50}
    placeholder="5x in 3 years"
    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
  />
  <div className="flex justify-end">
    <span className={`text-xs ${charCounts.investorROI > 45 ? 'text-amber-600' : 'text-gray-500'}`}>
      {charCounts.investorROI}/50 characters
    </span>
  </div>
</div>
                      <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Equity Available
  </label>
  <input
    type="text"
    name="equityAvailable"
    value={formData.equityAvailable ?? ''}
    onChange={handleChange}
    maxLength={50}
    placeholder="15%"
    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
  />
  <div className="flex justify-end">
    <span className={`text-xs ${charCounts.equityAvailable > 45 ? 'text-amber-600' : 'text-gray-500'}`}>
      {charCounts.equityAvailable}/50 characters
    </span>
  </div>
</div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-4 pt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancelClick}
                    className="bg-white text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    {selectedStartup ? 'Update Startup' : 'Create Startup'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="mt-4 p-4 text-red-700 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}
      </div>
    </EntrepreneurSidebar>
  );
};

export default StartupsPage;