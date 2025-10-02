'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function CreateWorkoutPage() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sets: '',
    reps: '',
    notes: '',
    referenceLink: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  const categories = ['Legs', 'Arms', 'Cardio', 'Core', 'Back', 'Chest', 'Shoulders', 'Full Body', 'Other'];

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

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
    if (!formData.name || !formData.category || !formData.sets || !formData.reps) {
      setError('Name, category, sets, and reps are required');
      setIsLoading(false);
      return;
    }

    if (isNaN(formData.sets) || formData.sets < 1 || formData.sets > 50) {
      setError('Sets must be a number between 1 and 50');
      setIsLoading(false);
      return;
    }

    if (isNaN(formData.reps) || formData.reps < 1 || formData.reps > 1000) {
      setError('Reps must be a number between 1 and 1000');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          sets: parseInt(formData.sets),
          reps: parseInt(formData.reps),
          notes: formData.notes,
          referenceLink: formData.referenceLink,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/workouts');
      } else {
        setError(data.error || 'Failed to create workout');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-black" />
          <p className="text-gray-600">Loading...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Create Workout</h1>
          <p className="text-gray-600 mt-2">Build a new workout routine for yourself and the community</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Workout Details</CardTitle>
            <CardDescription>
              Fill in the details for your workout. All fields except notes and reference link are required.
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
                <Label htmlFor="name">Workout Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Squat, Push-ups, Running"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sets">Sets *</Label>
                  <Input
                    id="sets"
                    name="sets"
                    type="number"
                    value={formData.sets}
                    onChange={handleChange}
                    required
                    min="1"
                    max="50"
                    placeholder="3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reps">Reps *</Label>
                  <Input
                    id="reps"
                    name="reps"
                    type="number"
                    value={formData.reps}
                    onChange={handleChange}
                    required
                    min="1"
                    max="1000"
                    placeholder="12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any additional notes about this workout..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenceLink">Reference Link (Optional)</Label>
                <Input
                  id="referenceLink"
                  name="referenceLink"
                  type="url"
                  value={formData.referenceLink}
                  onChange={handleChange}
                  placeholder="https://example.com/workout-guide"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Workout'
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
