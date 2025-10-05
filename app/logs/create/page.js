'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { ArrowLeft, Loader2, Calendar, Share2 } from 'lucide-react';

function CreateLogPageContent() {
  const [formData, setFormData] = useState({
    workoutId: '',
    completedAt: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:MM
    duration: '',
    notes: '',
    isShared: false,
  });
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkAuthCallback = useCallback(async () => {
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

  const fetchWorkoutsCallback = useCallback(async () => {
    try {
      const response = await fetch('/api/workouts');
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data.workouts);
      }
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    } finally {
      setIsLoadingWorkouts(false);
    }
  }, []);

  useEffect(() => {
    checkAuthCallback();
    fetchWorkoutsCallback();
    
    // Pre-select workout if workoutId is provided in URL
    const workoutId = searchParams.get('workoutId');
    if (workoutId) {
      setFormData(prev => ({ ...prev, workoutId }));
    }
  }, [searchParams, checkAuthCallback, fetchWorkoutsCallback]);


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
    if (!formData.workoutId || !formData.completedAt || !formData.duration) {
      setError('Workout, completion date, and duration are required');
      setIsLoading(false);
      return;
    }

    if (isNaN(formData.duration) || formData.duration < 1 || formData.duration > 1440) {
      setError('Duration must be a number between 1 and 1440 minutes');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workoutId: formData.workoutId,
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
        setError(data.error || 'Failed to log workout');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || isLoadingWorkouts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-8 w-8 animate-spin mx-auto mb-4 text-black" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const selectedWorkout = workouts.find(w => w._id === formData.workoutId);

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
          <h1 className="text-3xl font-bold text-gray-900">Log Workout</h1>
          <p className="text-gray-600 mt-2">Record a completed workout session</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Workout Session Details</CardTitle>
            <CardDescription>
              Fill in the details about your completed workout session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="workoutId">Workout *</Label>
                <Select value={formData.workoutId} onValueChange={(value) => setFormData({...formData, workoutId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a workout" />
                  </SelectTrigger>
                  <SelectContent>
                    {workouts.map((workout) => (
                      <SelectItem key={workout._id} value={workout._id}>
                        {workout.name} ({workout.category}) - {workout.sets} sets × {workout.reps} reps
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedWorkout && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      <strong>{selectedWorkout.name}</strong> - {selectedWorkout.sets} sets × {selectedWorkout.reps} reps
                    </p>
                    {selectedWorkout.notes && (
                      <p className="text-sm text-gray-500 mt-1">{selectedWorkout.notes}</p>
                    )}
                  </div>
                )}
              </div>

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
                      Logging...
                    </>
                  ) : (
                    'Log Workout'
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

export default function CreateLogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <Calendar className="h-8 w-8 animate-spin text-black" />
    </div>}>
      <CreateLogPageContent />
    </Suspense>
  );
}
