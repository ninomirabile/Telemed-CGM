#!/bin/bash

# 🏥 Telemed-CGM - Start Script
# Autore: Antonino Mirabile
# Licenza: CC BY-NC 4.0

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Function to wait for service to be ready
wait_for_service() {
    local host=$1
    local port=$2
    local service_name=$3
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if nc -z $host $port 2>/dev/null; then
            print_success "$service_name is ready!"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts - $service_name not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to start after $max_attempts attempts"
    return 1
}

# Function to start backend
start_backend() {
    print_status "Starting backend..."
    
    if [ ! -d "backend" ]; then
        print_error "Backend directory not found!"
        return 1
    fi
    
    cd backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        print_status "Creating virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    print_status "Activating virtual environment..."
    source venv/bin/activate
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    pip install -r requirements.txt
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        print_warning "No .env file found, creating from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_warning "Please update .env with your configuration"
        else
            print_error "No .env.example found!"
            return 1
        fi
    fi
    
    # Start backend
    print_status "Starting FastAPI backend..."
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    
    cd ..
    
    # Wait for backend to be ready
    wait_for_service "localhost" 8000 "Backend"
}

# Function to start frontend
start_frontend() {
    print_status "Starting frontend..."
    
    if [ ! -d "frontend" ]; then
        print_error "Frontend directory not found!"
        return 1
    fi
    
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        print_warning "No .env file found, creating from .env.example..."
        if [ -f "env.example" ]; then
            cp env.example .env
            print_warning "Please update .env with your configuration"
        else
            print_error "No .env.example found!"
            return 1
        fi
    fi
    
    # Start frontend
    print_status "Starting React frontend..."
    npm run dev &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../frontend.pid
    
    cd ..
    
    # Wait for frontend to be ready
    wait_for_service "localhost" 5173 "Frontend"
}

# Function to start database (if using Docker)
start_database() {
    if command_exists docker; then
        print_status "Checking if PostgreSQL container is running..."
        
        if ! docker ps | grep -q postgres; then
            print_status "Starting PostgreSQL container..."
            # Remove existing PostgreSQL container if present
            if docker ps -a --format '{{.Names}}' | grep -q '^telemed-postgres$'; then
                print_warning "Removing existing PostgreSQL container..."
                docker rm -f telemed-postgres
            fi
            docker run -d \
                --name telemed-postgres \
                -e POSTGRES_PASSWORD=postgres \
                -e POSTGRES_DB=telemed_cgm \
                -p 5432:5432 \
                postgres:14
            
            # Wait for database to be ready
            wait_for_service "localhost" 5432 "PostgreSQL"
        else
            print_success "PostgreSQL container already running"
        fi
        
        print_status "Checking if Redis container is running..."
        
        if ! docker ps | grep -q redis; then
            print_status "Starting Redis container..."
            # Remove existing Redis container if present
            if docker ps -a --format '{{.Names}}' | grep -q '^telemed-redis$'; then
                print_warning "Removing existing Redis container..."
                docker rm -f telemed-redis
            fi
            docker run -d \
                --name telemed-redis \
                -p 6379:6379 \
                redis:6-alpine
            
            # Wait for Redis to be ready
            wait_for_service "localhost" 6379 "Redis"
        else
            print_success "Redis container already running"
        fi
    else
        print_warning "Docker not found. Please ensure PostgreSQL and Redis are running manually."
    fi
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command_exists node; then
        print_error "Node.js is not installed!"
        print_status "Please install Node.js 18+ from https://nodejs.org/"
        return 1
    fi
    
    # Check npm
    if ! command_exists npm; then
        print_error "npm is not installed!"
        return 1
    fi
    
    # Check Python
    if ! command_exists python3; then
        print_error "Python 3 is not installed!"
        print_status "Please install Python 3.11+ from https://python.org/"
        return 1
    fi
    
    # Check ports
    if port_in_use 8000; then
        print_warning "Port 8000 is already in use (backend)"
    fi
    
    if port_in_use 5173; then
        print_warning "Port 5173 is already in use (frontend)"
    fi
    
    print_success "Prerequisites check completed"
}

# Main function
main() {
    echo "🏥 Telemed-CGM - Starting Application"
    echo "====================================="
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Start database
    start_database
    
    # Start backend
    start_backend
    
    # Start frontend
    start_frontend
    
    echo ""
    echo "🎉 Application started successfully!"
    echo ""
    echo "📱 Frontend: http://localhost:5173"
    echo "🔧 Backend API: http://localhost:8000"
    echo "📚 API Docs: http://localhost:8000/docs"
    echo ""
    echo "To stop the application, run: ./stop.sh"
    echo ""
    
    # Keep script running to maintain background processes
    print_status "Press Ctrl+C to stop all services..."
    
    # Trap to handle cleanup on exit
    trap 'echo ""; print_status "Stopping services..."; ./stop.sh; exit 0' INT TERM
    
    # Wait indefinitely
    while true; do
        sleep 1
    done
}

# Run main function
main "$@" 