import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Workout from '../../../models/Workout';
import { getUserFromToken } from '../../../lib/auth';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Get workouts with pagination
    const workouts = await Workout.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Workout.countDocuments(filter);

    return NextResponse.json({
      workouts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { name, category, sets, reps, notes, referenceLink } = await request.json();

    // Validation
    if (!name || !category || !sets || !reps) {
      return NextResponse.json(
        { error: 'Name, category, sets, and reps are required' },
        { status: 400 }
      );
    }

    // Create workout
    const workout = await Workout.create({
      name,
      category,
      sets,
      reps,
      notes: notes || '',
      referenceLink: referenceLink || '',
      createdBy: user._id,
    });

    // Populate the createdBy field
    await workout.populate('createdBy', 'name email');

    return NextResponse.json(
      {
        message: 'Workout created successfully',
        workout,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create workout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
