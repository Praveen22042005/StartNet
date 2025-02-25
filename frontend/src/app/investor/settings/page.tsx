"use client";

import React, { useState } from 'react';
import InvestorSidebar from '@/app/sidebar/investor/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { API_ROUTES } from '@/config/api';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const InvestorSettingsPage = () => {
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      const response = await fetch(API_ROUTES.INVESTOR.UPDATE_PASSWORD, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password updated successfully');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (confirmed) {
      try {
        const response = await fetch(API_ROUTES.INVESTOR.DELETE_ACCOUNT, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          localStorage.removeItem('token');
          window.location.href = '/auth/login';
          toast.success('Account deleted successfully');
        } else {
          const data = await response.json();
          toast.error(data.message || 'Failed to delete account');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        toast.error('Failed to delete account');
      }
    }
  };

  return (
    <InvestorSidebar>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Account Settings</h1>

        <div className="space-y-8">
          {/* Change Password Section */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:ring-black"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-gray-900 text-white hover:bg-gray-800"
                >
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Delete Account Section */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Delete Account
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 mb-4">
                Warning: This action cannot be undone. All your data will be permanently deleted.
              </p>
              <Button
                type="button"
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </InvestorSidebar>
  );
};

export default InvestorSettingsPage;