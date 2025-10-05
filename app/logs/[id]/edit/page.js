'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { ArrowLeft, Loader2, Calendar, Share2 } from 'lucide-react';

export default function EditLogPage() {
  const [formData, setFormData] = useState({
    completedAt: '',
    duration: '',
    notes: '',
    isShared: false,
  });
  const [workout, setWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLog, setIsLoadingLog] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();
  const params = useParams();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    }
  }, [router]);

  const fetchLog = useCallback(async () => {
    try {
      const response = await fetch(`/api/logs/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        const log = data.log;
        
        // Check if user is the owner
        if (log.userId.toString() !== user?._id.toString()) {
          router.push('/logs');
          return;
        }
        
        if (log.workoutId) {
          setWorkout(log.workoutId);
        } else {
          // If workout is missing, redirect back to logs
          router.push('/logs');
          return;
        }
        
        setFormData({
          completedAt: new Date(log.completedAt).toISOString().slice(0, 16),
          duration: log.duration.toString(),
          notes: log.notes || '',
          isShared: log.isShared || false,
        });
      } else {
        router.push('/logs');
      }
    } catch (error) {
      console.error('Failed to fetch log:', error);
      router.push('/logs');
    } finally {
      setIsLoadingLog(false);
    }
  }, [params.id, user, router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user && params.id) {
      fetchLog();
    }
  }, [user, params.id, fetchLog]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!formData.completedAt || !formData.duration) {
      setError('Completion date and duration are required');
      setIsLoading(false);
      return;
    }

    if (isNaN(formData.duration) || formData.duration < 1 || formData.duration > 1440) {
      setError('Duration must be a number between 1 and 1440 minutes');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/logs/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completedAt: new Date(formData.completedAt).toISOString(),
          duration: parseInt(formData.duration),
          notes: formData.notes,
          isShared: formData.isShared,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/logs');
      } else {
        setError(data.error || 'Failed to update log');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingLog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-8 w-8 animate-spin mx-auto mb-4 text-black" />
          <p className="text-gray-600">Loading log...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Workout Log</h1>
          <p className="text-gray-600 mt-2">Update your workout session details</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Workout Session Details</CardTitle>
            <CardDescription>
              Update the details about your completed workout session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {workout ? (
                <div className="space-y-2">
                  <Label>Workout</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">{workout.name}</p>
                    <p className="text-sm text-gray-600">
                      {workout.category} - {workout.sets} sets × {workout.reps} reps
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Workout</Label>
                  <div className="p-3 bg-red-50 rounded-md">
                    <p className="text-red-600">Workout not found or deleted</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="completedAt">Completion Date & Time *</Label>
                <Input
                  id="completedAt"
                  name="completedAt"
                  type="datetime-local"
                  value={formData.completedAt}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="1"
                  max="1440"
                  placeholder="30"
                />
                <p className="text-sm text-gray-500">
                  Enter the total duration of your workout in minutes (1-1440)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="How did the workout feel? Any observations or notes..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isShared"
                    name="isShared"
                    checked={formData.isShared}
                    onChange={(e) => setFormData({ ...formData, isShared: e.target.checked })}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <Label htmlFor="isShared" className="flex items-center space-x-2">
                    <Share2 className="h-4 w-4" />
                    <span>Share with the community</span>
                  </Label>
                </div>
                <p className="text-sm text-gray-500">
                  When shared, your workout log will be visible to other GrindX users in the community feed.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Log'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
