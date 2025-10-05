import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Log from '../../../models/Log';
import { verifyTokenFromRequest } from '../../../lib/auth';

export async function GET(request) {
  try {
    await connectDB();

    // Verify authentication
    const user = await verifyTokenFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    const shared = searchParams.get('shared') === 'true';

    let query, total;
    
    if (shared) {
      // Get shared logs from all users
      query = { isShared: true };
      total = await Log.countDocuments(query);
    } else {
      // Get user's own logs
      query = { userId: user._id };
      total = await Log.countDocuments(query);
    }

    // Get logs with pagination
    const logs = await Log.find(query)
      .populate('workoutId', 'name category sets reps')
      .populate('userId', 'name email')
      .populate('likes', 'name')
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limit);

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

    // Verify authentication
    const user = await verifyTokenFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { workoutId, completedAt, duration, notes, isShared } = await request.json();

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
      isShared: isShared || false,
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
