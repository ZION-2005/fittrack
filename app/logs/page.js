'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import DeleteDialog from '../../components/ui/delete-dialog';
import { Calendar, Plus, Edit, Trash2, Dumbbell, Clock } from 'lucide-react';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    logId: null,
    logName: '',
    isLoading: false,
  });
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

  const fetchLogs = useCallback(async () => {
    try {
      const response = await fetch('/api/logs');
      if (response.ok) {
        const data = await response.json();
        // Filter out logs with missing workoutId to prevent undefined errors
        const validLogs = data.logs.filter(log => log.workoutId && log.workoutId.name);
        setLogs(validLogs);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    fetchLogs();
  }, [checkAuth, fetchLogs]);

  const handleDeleteClick = (logId, logName) => {
    setDeleteDialog({
      isOpen: true,
      logId,
      logName,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialog(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(`/api/logs/${deleteDialog.logId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLogs(logs.filter(log => log._id !== deleteDialog.logId));
        setDeleteDialog({ isOpen: false, logId: null, logName: '', isLoading: false });
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete log');
        setDeleteDialog(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Failed to delete log:', error);
      alert('An error occurred while deleting the log');
      setDeleteDialog(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, logId: null, logName: '', isLoading: false });
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-12 w-12 animate-spin mx-auto mb-4 text-black" />
          <p className="text-gray-600">Loading your workout logs...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Workout Logs</h1>
            <p className="text-gray-600">Track your fitness progress and workout history</p>
          </div>
          <Button 
            onClick={() => router.push('/logs/create')}
            className="mt-4 sm:mt-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Workout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(logs.reduce((total, log) => total + log.duration, 0))} min
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {logs.filter(log => {
                  const logDate = new Date(log.completedAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return logDate >= weekAgo;
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logs List */}
        {logs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No workout logs yet</h3>
              <p className="text-gray-600 mb-4">
                Start logging your workouts to track your progress!
              </p>
              <Button onClick={() => router.push('/logs/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Log Your First Workout
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {logs.map((log) => (
              <Card key={log._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {log.workoutId?.name || 'Unknown Workout'}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-black text-xs rounded-full">
                          {log.workoutId?.category || 'Unknown'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {log.workoutId?.sets || 0} sets × {log.workoutId?.reps || 0} reps
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/logs/${log._id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(log._id, log.workoutId?.name || 'Unknown Workout')}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Completed</p>
                      <p className="font-medium">{formatDate(log.completedAt)}</p>
                      <p className="text-sm text-gray-500">{formatTime(log.completedAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Duration</p>
                      <p className="font-medium">{log.duration} minutes</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Notes</p>
                      {log.notes ? (
                        <p className="font-medium text-sm">{log.notes}</p>
                      ) : (
                        <p className="text-gray-400 text-sm">No notes</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <DeleteDialog
          isOpen={deleteDialog.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Workout Log"
          description="Are you sure you want to delete this workout log? This action cannot be undone."
          itemName={deleteDialog.logName}
          isLoading={deleteDialog.isLoading}
        />
      </div>
    </div>
  );
}
