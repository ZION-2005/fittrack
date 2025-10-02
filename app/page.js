'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dumbbell, Calendar, BarChart3, Users, Target, Zap } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    
    // Listen for custom logout event
    const handleLogout = () => {
      setUser(null);
      setIsLoading(false);
    };
    
    // Listen for custom login event
    const handleLogin = () => {
      checkAuth();
    };
    
    // Listen for focus event to re-check auth when user comes back to tab
    const handleFocus = () => {
      checkAuth();
    };
    
    window.addEventListener('logout', handleLogout);
    window.addEventListener('login', handleLogin);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('logout', handleLogout);
      window.removeEventListener('login', handleLogin);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-4 rounded-full">
              <Dumbbell className="h-16 w-16 text-black" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Track Your Fitness
            <span className="text-black"> Journey</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create workouts, log your progress, and achieve your fitness goals with FitTrack. 
            Join a community of fitness enthusiasts and stay motivated on your journey.
          </p>
          
          {!user && !isLoading && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
          
          {user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/workouts">
                <Button size="lg" className="text-lg px-8 py-6">
                  View Workouts
                </Button>
              </Link>
              <Link href="/logs">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  My Logs
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              FitTrack provides all the tools you need to create, track, and achieve your fitness goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="bg-gray-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Dumbbell className="h-8 w-8 text-black" />
                </div>
                <CardTitle>Create Workouts</CardTitle>
                <CardDescription>
                  Build custom workout routines with sets, reps, and categories. 
                  Share your workouts with the community or keep them private.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-gray-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-black" />
                </div>
                <CardTitle>Log Progress</CardTitle>
                <CardDescription>
                  Track your workout sessions with duration, notes, and completion dates. 
                  Keep a detailed history of your fitness journey.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-gray-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-black" />
                </div>
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  Monitor your fitness progress over time. View your workout history 
                  and see how you&apos;re improving day by day.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-gray-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-black" />
                </div>
                <CardTitle>Community</CardTitle>
                <CardDescription>
                  Discover workouts created by other fitness enthusiasts. 
                  Get inspired and share your own routines with the community.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-gray-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Target className="h-8 w-8 text-black" />
                </div>
                <CardTitle>Set Goals</CardTitle>
                <CardDescription>
                  Define your fitness goals and track your progress towards achieving them. 
                  Stay motivated with clear, measurable objectives.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-gray-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Zap className="h-8 w-8 text-black" />
                </div>
                <CardTitle>Stay Motivated</CardTitle>
                <CardDescription>
                  Keep your fitness journey engaging with a clean, intuitive interface. 
                  Focus on what matters most - your health and progress.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who are already tracking their progress with FitTrack.
          </p>
          {!user && (
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Create Your Account
              </Button>
            </Link>
          )}
          
          {user && (
            <Link href="/workouts">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Start Working Out
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
