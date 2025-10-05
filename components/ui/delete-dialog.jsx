'use client';

import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  itemName,
  isLoading = false 
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {itemName && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">
                <strong>Item:</strong> {itemName}
              </p>
            </div>
          )}
          
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
