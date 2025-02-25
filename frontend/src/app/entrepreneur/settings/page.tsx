"use client";

import React, { useState } from 'react';
import EntrepreneurSidebar from '@/app/sidebar/entrepreneur/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { API_ROUTES } from '@/config/api';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SettingsPage = () => {
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
      console.log('❌ Password mismatch: New passwords do not match');
      toast.error('New passwords do not match');
      return;
    }

    console.log('Attempting password update with:', {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });

    try {
      console.log('Making API request to:', API_ROUTES.AUTH.UPDATE_PASSWORD);
      console.log('Request headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      });

      const response = await fetch(API_ROUTES.AUTH.UPDATE_PASSWORD, {
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

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        console.log('✅ Password updated successfully');
        toast.success('Password updated successfully');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        console.log('❌ Error response:', {
          status: response.status,
          data: data
        });
        toast.error(data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      toast.error('Failed to update password');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (confirmed) {
      // Will implement API call in backend response
      toast.success('Account deleted successfully');
    }
  };

  return (
    <EntrepreneurSidebar>
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
                  className="bg-black text-white hover:bg-gray-800"
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
                Warning: This action cannot be undone. All your data, including startups and team information, will be permanently deleted.
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
    </EntrepreneurSidebar>
  );
};

export default SettingsPage;