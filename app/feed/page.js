'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Users, Share2, Clock, Dumbbell, User, Loader2 } from 'lucide-react';

export default function FeedPage() {
  const [sharedLogs, setSharedLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const observerRef = useRef();
  const lastLogRef = useRef();

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

  const fetchSharedLogs = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await fetch(`/api/logs?shared=true&page=${page}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        
        if (append) {
          setSharedLogs(prev => [...prev, ...data.logs]);
        } else {
          setSharedLogs(data.logs);
        }
        
        setHasMore(data.pagination.page < data.pagination.pages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Failed to fetch shared logs:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          fetchSharedLogs(currentPage + 1, true);
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, currentPage, fetchSharedLogs]);

  // Set up observer for last log element
  useEffect(() => {
    if (lastLogRef.current && observerRef.current) {
      observerRef.current.observe(lastLogRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sharedLogs]);

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
            {filteredLogs.map((log, index) => (
              <Card 
                key={log._id} 
                className="hover:shadow-lg transition-shadow"
                ref={index === filteredLogs.length - 1 ? lastLogRef : null}
              >
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
            
            {/* Loading more indicator */}
            {isLoadingMore && (
              <div className="flex justify-center py-8">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading more posts...</span>
                </div>
              </div>
            )}
            
            {/* End of feed indicator */}
            {!hasMore && filteredLogs.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">You&apos;ve reached the end of the feed!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
