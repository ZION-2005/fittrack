'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import DeleteDialog from '../../components/ui/delete-dialog';
import { Dumbbell, Plus, Search, Filter, Edit, Trash2, ExternalLink } from 'lucide-react';

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    workoutId: null,
    workoutName: '',
    isLoading: false,
  });
  const router = useRouter();

  const categories = ['All', 'Legs', 'Arms', 'Cardio', 'Core', 'Back', 'Chest', 'Shoulders', 'Full Body', 'Other'];

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

  const fetchWorkouts = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      params.append('page', page.toString());
      params.append('limit', '12');
      
      const response = await fetch(`/api/workouts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data.workouts);
        setTotalPages(data.pagination.pages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    checkAuth();
    fetchWorkouts();
  }, [checkAuth, fetchWorkouts]);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
    fetchWorkouts(1);
  }, [selectedCategory, fetchWorkouts]);

  const handleDeleteClick = (workoutId, workoutName) => {
    setDeleteDialog({
      isOpen: true,
      workoutId,
      workoutName,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialog(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(`/api/workouts/${deleteDialog.workoutId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWorkouts(workouts.filter(workout => workout._id !== deleteDialog.workoutId));
        setDeleteDialog({ isOpen: false, workoutId: null, workoutName: '', isLoading: false });
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete workout');
        setDeleteDialog(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Failed to delete workout:', error);
      alert('An error occurred while deleting the workout');
      setDeleteDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, workoutId: null, workoutName: '', isLoading: false });
  };

  const filteredWorkouts = workouts.filter(workout =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="h-12 w-12 animate-spin mx-auto mb-4 text-black" />
          <p className="text-gray-600">Loading workouts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Workouts</h1>
            <p className="text-gray-600">Discover and create workout routines</p>
          </div>
          <Button 
            onClick={() => router.push('/workouts/create')}
            className="mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Workout
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
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
        </div>

        {/* Workouts Grid */}
        {filteredWorkouts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Dumbbell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No workouts found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory !== 'All' 
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to create a workout!'
                }
              </p>
              <Button onClick={() => router.push('/workouts/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Workout
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkouts.map((workout) => (
              <Card key={workout._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{workout.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-black text-xs rounded-full">
                          {workout.category}
                        </span>
                      </CardDescription>
                    </div>
                    {user && workout.createdBy._id === user._id && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/workouts/${workout._id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(workout._id, workout.name)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sets:</span>
                      <span className="font-medium">{workout.sets}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Reps:</span>
                      <span className="font-medium">{workout.reps}</span>
                    </div>
                    {workout.notes && (
                      <div className="text-sm text-gray-600">
                        <p className="line-clamp-2">{workout.notes}</p>
                      </div>
                    )}
                    {workout.referenceLink && (
                      <div className="pt-2">
                        <a
                          href={workout.referenceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-black hover:text-gray-700"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Reference
                        </a>
                      </div>
                    )}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Created by {workout.createdBy.name}</span>
                        <span>{new Date(workout.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-3"
                      onClick={() => router.push(`/logs/create?workoutId=${workout._id}`)}
                    >
                      Log This Workout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchWorkouts(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => fetchWorkouts(page)}
                  disabled={isLoading}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchWorkouts(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        )}

        <DeleteDialog
          isOpen={deleteDialog.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Workout"
          description="Are you sure you want to delete this workout? This action cannot be undone."
          itemName={deleteDialog.workoutName}
          isLoading={deleteDialog.isLoading}
        />
      </div>
    </div>
  );
}
