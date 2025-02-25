"use client";
import React, { useState, useEffect } from 'react';
import InvestorSidebar from '@/app/sidebar/investor/page';
import { API_ROUTES } from '@/config/api';
import { Startup, StartupResponse } from '@/types/startup';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import StartupCard from '@/components/startups/StartupCard';

const INDUSTRY_OPTIONS = [
  'All',
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'E-commerce',
  'Manufacturing',
  'Other'
];

const InvestorStartupsPage = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '9',
        ...(searchQuery && { search: searchQuery }),
        ...(industryFilter !== 'All' && { industry: industryFilter })
      });

      const response = await fetch(`${API_ROUTES.INVESTOR.STARTUPS.GET_ALL}?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch startups');
      }

      const data: StartupResponse = await response.json();
      setStartups(data.startups);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching startups:', error);
      toast.error('Failed to fetch startups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, [page, searchQuery, industryFilter]);

  return (
    <InvestorSidebar>
      <div className="container mx-auto p-4 md:p-8">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            {/* Header Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Explore Startups</h1>
              <p className="text-gray-600">Discover promising startup opportunities</p>
            </div>

            <Separator className="my-6" />

            {/* Search and Filter Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search startups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-white border-gray-200"
                />
              </div>

              <Select 
                value={industryFilter} 
                onValueChange={setIndustryFilter}
              >
                <SelectTrigger className="w-full bg-white border-gray-200">
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {INDUSTRY_OPTIONS.map((option) => (
                      <SelectItem 
                        key={option} 
                        value={option}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center my-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {startups.length > 0 ? (
                  startups.map((startup) => (
                    <StartupCard key={startup._id} startup={startup} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No startups found matching your criteria
                  </div>
                )}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && startups.length > 0 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </InvestorSidebar>
  );
};

export default InvestorStartupsPage;