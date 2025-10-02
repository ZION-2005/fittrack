import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Log from '../../../../models/Log';
import { getUserFromToken } from '../../../../lib/auth';

export async function GET(request, { params }) {
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

    const log = await Log.findById(params.id)
      .populate('workoutId', 'name category sets reps');

    if (!log) {
      return NextResponse.json(
        { error: 'Log not found' },
        { status: 404 }
      );
    }

    // Check if user owns this log
    if (log.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Not authorized to view this log' },
        { status: 403 }
      );
    }

    return NextResponse.json({ log });
  } catch (error) {
    console.error('Get log error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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

    const log = await Log.findById(params.id);

    if (!log) {
      return NextResponse.json(
        { error: 'Log not found' },
        { status: 404 }
      );
    }

    // Check if user owns this log
    if (log.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Not authorized to edit this log' },
        { status: 403 }
      );
    }

    const { completedAt, duration, notes } = await request.json();

    // Update log entry
    const updatedLog = await Log.findByIdAndUpdate(
      params.id,
      {
        ...(completedAt && { completedAt: new Date(completedAt) }),
        ...(duration && { duration }),
        ...(notes !== undefined && { notes }),
      },
      { new: true }
    ).populate('workoutId', 'name category sets reps');

    return NextResponse.json(
      {
        message: 'Log updated successfully',
        log: updatedLog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update log error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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

    const log = await Log.findById(params.id);

    if (!log) {
      return NextResponse.json(
        { error: 'Log not found' },
        { status: 404 }
      );
    }

    // Check if user owns this log
    if (log.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Not authorized to delete this log' },
        { status: 403 }
      );
    }

    await Log.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: 'Log deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete log error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
