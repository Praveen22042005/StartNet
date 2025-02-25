"use client";
import React, { useState, useEffect } from 'react';
import EntrepreneurSidebar from '@/app/sidebar/entrepreneur/page';
import InvestorCard from '@/components/investors/InvestorCard';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { API_ROUTES } from '@/config/api';
import { toast } from 'react-hot-toast';

const PORTFOLIO_SIZE_OPTIONS = [
  'All',
  'Under $100K',
  '$100K - $500K',
  '$1M - $1M',
  '$1M - $5M',
  '$5M - $10M',
  'Over $10M'
];

interface Investor {
  _id: string;
  fullName: string;
  location: string;
  profilePicture: string;
  bio: string;
  portfolioSize: string;
  investmentRange: {
    min: number;
    max: number;
  };
  skills: Array<{ name: string }>;
}

const InvestorsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [portfolioFilter, setPortfolioFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInvestors = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '9',
        ...(searchQuery && { search: searchQuery }),
        ...(portfolioFilter !== 'All' && { portfolioSize: portfolioFilter })
      });

      const response = await fetch(`${API_ROUTES.INVESTOR_PROFILE.GET_ALL}?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setInvestors(data.investors);
        setTotalPages(data.pagination.pages);
      } else {
        throw new Error(data.message || 'Failed to fetch investors');
      }
    } catch (error) {
      console.error('Error fetching investors:', error);
      toast.error('Failed to fetch investors');
    } finally {
      setLoading(false);
    }
  };

  // Fetch investors when search, filter, or page changes
  useEffect(() => {
    fetchInvestors();
  }, [searchQuery, portfolioFilter, page]);

  return (
    <EntrepreneurSidebar>
      <div className="container mx-auto p-4 md:p-8">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            {/* Header Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Investors</h1>
              <p className="text-gray-600">Browse potential investors for your startup</p>
            </div>

            <Separator className="my-6" />

            {/* Search and Filter Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search investors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Select value={portfolioFilter} onValueChange={setPortfolioFilter}>
                <SelectTrigger className="w-full bg-white border-gray-200">
                  <SelectValue placeholder="Filter by portfolio size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PORTFOLIO_SIZE_OPTIONS.map((option) => (
                      <SelectItem 
                        key={option} 
                        value={option}
                        className="cursor-pointer hover:bg-gray-100 text-gray-900"
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
              </div>
            ) : (
              /* Investors Grid */
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {investors.length > 0 ? (
                  investors.map((investor) => (
                    <InvestorCard key={investor._id} investor={investor} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No investors found matching your criteria
                  </div>
                )}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && investors.length > 0 && (
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
    </EntrepreneurSidebar>
  );
};

export default InvestorsPage;