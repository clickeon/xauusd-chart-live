# Use Python 3.9 slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install -r requirements.txt

# Copy the rest of the application
COPY . .

# Set environment variables
ENV PORT=8080

# Expose port
EXPOSE 8080

# Run the application
CMD exec gunicorn --bind :$PORT app:app
