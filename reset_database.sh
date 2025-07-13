#!/bin/bash

# =================================================================
# Full Database Reset Script
# =================================================================
# This script will completely wipe and repopulate the remote Supabase
# database. It performs the following steps:
# 1. Regenerates the comprehensive flight data SQL script.
# 2. Connects to the database and executes the main initialization
#    script, which clears old tables and loads all new data.
# =================================================================

echo "🚀 Starting full database reset..."
echo ""

# Step 1: Regenerate the comprehensive flight data
echo "1. Generating fresh flight data (01_COMPREHENSIVE_FLIGHTS.sql)..."
node scripts/generate-flight-data.js

# Check if the generation was successful
if [ $? -ne 0 ]; then
    echo "❌ Error: Flight data generation failed. Aborting."
    exit 1
fi

echo "✅ Flight data generated successfully."
echo ""

# Step 2: Execute the main database initialization script
echo "2. Wiping and repopulating the remote database..."
echo "   You will be prompted for your database password."
echo ""

psql -h db.wqvntnuxozeeavhfpiad.supabase.co -p 5432 -U postgres -d postgres -f 00_INIT_DATABASE.sql

# Check if psql command was successful
if [ $? -ne 0 ]; then
    echo "❌ Error: Database reset failed. Please check your password and connection."
    exit 1
fi

echo ""
echo "🎉 Database reset complete! Your database is now as fresh as hell."