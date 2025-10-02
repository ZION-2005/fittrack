import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Workout from '../../../../models/Workout';
import { getUserFromToken } from '../../../../lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const workout = await Workout.findById(params.id)
      .populate('createdBy', 'name email');

    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ workout });
  } catch (error) {
    console.error('Get workout error:', error);
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

    const workout = await Workout.findById(params.id);

    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    // Check if user is the creator
    if (workout.createdBy.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Not authorized to edit this workout' },
        { status: 403 }
      );
    }

    const { name, category, sets, reps, notes, referenceLink } = await request.json();

    // Update workout
    const updatedWorkout = await Workout.findByIdAndUpdate(
      params.id,
      {
        ...(name && { name }),
        ...(category && { category }),
        ...(sets && { sets }),
        ...(reps && { reps }),
        ...(notes !== undefined && { notes }),
        ...(referenceLink !== undefined && { referenceLink }),
      },
      { new: true }
    ).populate('createdBy', 'name email');

    return NextResponse.json(
      {
        message: 'Workout updated successfully',
        workout: updatedWorkout,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update workout error:', error);
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

    const workout = await Workout.findById(params.id);

    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      );
    }

    // Check if user is the creator
    if (workout.createdBy.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Not authorized to delete this workout' },
        { status: 403 }
      );
    }

    await Workout.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: 'Workout deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete workout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
