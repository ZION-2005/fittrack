import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Log from '../../../models/Log';
import { getUserFromToken } from '../../../lib/auth';

export async function GET(request) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Get user's logs with pagination
    const logs = await Log.find({ userId: user._id })
      .populate('workoutId', 'name category sets reps')
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Log.countDocuments({ userId: user._id });

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get logs error:', error);
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

    const { workoutId, completedAt, duration, notes } = await request.json();

    // Validation
    if (!workoutId || !completedAt || !duration) {
      return NextResponse.json(
        { error: 'Workout ID, completion date, and duration are required' },
        { status: 400 }
      );
    }

    // Create log entry
    const log = await Log.create({
      workoutId,
      userId: user._id,
      completedAt: new Date(completedAt),
      duration,
      notes: notes || '',
    });

    // Populate the workout field
    await log.populate('workoutId', 'name category sets reps');

    return NextResponse.json(
      {
        message: 'Workout logged successfully',
        log,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create log error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
