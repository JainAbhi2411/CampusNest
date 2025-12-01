/*
# Add Video URL to Properties

This migration adds a video_url column to the properties table to support property video tours.

## Changes

1. **Column: video_url**
   - Type: text (nullable)
   - Stores URL to property video tour
   - Optional field for properties

*/

-- Add video_url column to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS video_url text;