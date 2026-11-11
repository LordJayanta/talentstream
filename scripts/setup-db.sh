#!/bin/bash
set -e

echo "=== TalentStream Database Setup ==="

# 1. Start postgres service if not running
if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo "Starting PostgreSQL service..."
    sudo service postgresql start || true
fi

# 2. Configure postgres user password
echo "Configuring postgres user password..."
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password123';" || true

# 3. Create talentstream_db if it doesn't exist
echo "Ensuring talentstream_db database exists..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'talentstream_db'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE talentstream_db;"

echo "Database ready on postgres://postgres:password123@localhost:5432/talentstream_db"
