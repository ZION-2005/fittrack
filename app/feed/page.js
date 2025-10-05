'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Users, Share2, Clock, Dumbbell, User } from 'lucide-react';

export default function FeedPage() {
  const [sharedLogs, setSharedLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

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

  const fetchSharedLogs = useCallback(async () => {
    try {
      const response = await fetch('/api/logs?shared=true');
      if (response.ok) {
        const data = await response.json();
        setSharedLogs(data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch shared logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    fetchSharedLogs();
  }, [checkAuth, fetchSharedLogs]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredLogs = sharedLogs.filter(log =>
    log.workoutId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="h-12 w-12 animate-spin mx-auto mb-4 text-black" />
          <p className="text-gray-600">Loading community feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Feed</h1>
          <p className="text-gray-600">See what the GrindX community is up to</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <Input
            placeholder="Search workouts, users, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Feed */}
        {filteredLogs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Dumbbell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No matching posts found' : 'No shared workouts yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Be the first to share your workout progress with the community!'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => router.push('/logs/create')}>
                  Share Your First Workout
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredLogs.map((log) => (
              <Card key={log._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {log.userId?.name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(log.completedAt)} at {formatTime(log.completedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-black text-xs rounded-full">
                        {log.workoutId?.category || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Workout Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">
                        {log.workoutId?.name || 'Unknown Workout'}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{log.workoutId?.sets || 0} sets</span>
                        <span>×</span>
                        <span>{log.workoutId?.reps || 0} reps</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{log.duration} min</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {log.notes && (
                      <div>
                        <p className="text-gray-700">{log.notes}</p>
                      </div>
                    )}

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
