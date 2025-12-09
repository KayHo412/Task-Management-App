#!/bin/bash

# Create backup directory if it doesn't exist
mkdir -p backups

# Timestamp for unique file names
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Database container name
CONTAINER_NAME=course-project-hopeitworks-db-1

# Database credentials
DB_USER=postgres
DB_NAME=mydb

# Output file
BACKUP_FILE="backups/db_backup_${TIMESTAMP}.sql"

echo "🔄 Starting PostgreSQL backup..."
docker exec -t $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
  echo "✅ Backup completed successfully: $BACKUP_FILE"
else
  echo "❌ Backup failed!"
fi
