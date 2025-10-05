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
      } else if (response.status === 401) {
        // User is not authenticated - this is normal, don't log as error
        setUser(null);
      }
    } catch (error) {
      // Only log network errors, not auth failures
      console.error('Network error during auth check:', error);
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
            Join the GrindX
            <span className="text-black"> Community</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create workouts, share your progress, and get inspired by others in the GrindX fitness community. 
            Track your journey and motivate others along the way.
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
                  <Link href="/feed">
                    <Button size="lg" className="text-lg px-8 py-6">
                      Explore Community
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
              GrindX provides all the tools you need to create, track, and share your fitness journey with a supportive community.
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
                  Share your workouts with the community and inspire others.
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
                  Share your progress with the community and get motivated by others.
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
                  and see how you&apos;re improving day by day with community support.
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
                  Discover workouts and progress shared by other fitness enthusiasts. 
                  Get inspired, share your own routines, and build connections.
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
            Ready to Join the GrindX Community?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who are already sharing their fitness journey with GrindX.
          </p>
          {!user && (
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Create Your Account
              </Button>
            </Link>
          )}
          
          {user && (
            <Link href="/feed">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Explore Community
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
