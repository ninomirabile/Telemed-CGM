#!/bin/bash

# 🏥 Telemed-CGM - Stop Script
# Autore: Antonino Mirabile
# Licenza: CC BY-NC 4.0

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

# Function to check if process is running
process_running() {
    ps -p $1 >/dev/null 2>&1
}

# Function to kill process gracefully
kill_process() {
    local pid=$1
    local name=$2
    
    if [ -n "$pid" ] && process_running $pid; then
        print_status "Stopping $name (PID: $pid)..."
        kill $pid
        
        # Wait for process to stop
        local count=0
        while process_running $pid && [ $count -lt 10 ]; do
            sleep 1
            count=$((count + 1))
        done
        
        # Force kill if still running
        if process_running $pid; then
            print_warning "Force killing $name..."
            kill -9 $pid
        fi
        
        print_success "$name stopped"
    else
        print_warning "$name is not running"
    fi
}

# Function to stop frontend
stop_frontend() {
    print_status "Stopping frontend..."
    
    if [ -f "frontend.pid" ]; then
        local pid=$(cat frontend.pid)
        kill_process $pid "Frontend"
        rm -f frontend.pid
    else
        print_warning "No frontend PID file found"
        
        # Try to find and kill frontend process
        local frontend_pid=$(pgrep -f "npm run dev" || true)
        if [ -n "$frontend_pid" ]; then
            print_status "Found frontend process, stopping..."
            kill_process $frontend_pid "Frontend"
        fi
    fi
}

# Function to stop backend
stop_backend() {
    print_status "Stopping backend..."
    
    if [ -f "backend.pid" ]; then
        local pid=$(cat backend.pid)
        kill_process $pid "Backend"
        rm -f backend.pid
    else
        print_warning "No backend PID file found"
        
        # Try to find and kill backend process
        local backend_pid=$(pgrep -f "uvicorn main:app" || true)
        if [ -n "$backend_pid" ]; then
            print_status "Found backend process, stopping..."
            kill_process $backend_pid "Backend"
        fi
    fi
}

# Function to stop database containers
stop_database() {
    if command_exists docker; then
        print_status "Stopping database containers..."
        # Stop PostgreSQL container
        if docker ps | grep -q telemed-postgres; then
            print_status "Stopping PostgreSQL container..."
            docker stop telemed-postgres
            print_success "PostgreSQL container stopped"
        else
            print_warning "PostgreSQL container not running"
        fi
        # Stop Redis container
        if docker ps | grep -q telemed-redis; then
            print_status "Stopping Redis container..."
            docker stop telemed-redis
            print_success "Redis container stopped"
        else
            print_warning "Redis container not running"
        fi
        # Rimuovo sempre i container
        print_status "Removing containers..."
        docker rm telemed-postgres 2>/dev/null || true
        docker rm telemed-redis 2>/dev/null || true
        print_success "Containers removed"
    else
        print_warning "Docker not found. Please stop PostgreSQL and Redis manually."
    fi
}

# Function to cleanup temporary files
cleanup() {
    print_status "Cleaning up temporary files..."
    
    # Remove PID files
    rm -f frontend.pid backend.pid
    
    # Remove log files if they exist
    rm -f frontend.log backend.log
    
    # Clean npm cache if requested
    if [ "$1" = "--clean" ]; then
        print_status "Cleaning npm cache..."
        npm cache clean --force 2>/dev/null || true
        
        print_status "Cleaning Python cache..."
        find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
        find . -name "*.pyc" -delete 2>/dev/null || true
        
        print_success "Cache cleaned"
    fi
}

# Function to show status
show_status() {
    echo "🏥 Telemed-CGM - Service Status"
    echo "==============================="
    echo ""
    
    # Check frontend
    if [ -f "frontend.pid" ]; then
        local pid=$(cat frontend.pid)
        if process_running $pid; then
            print_success "Frontend: Running (PID: $pid)"
        else
            print_error "Frontend: Not running (stale PID file)"
        fi
    else
        local frontend_pid=$(pgrep -f "npm run dev" || true)
        if [ -n "$frontend_pid" ]; then
            print_success "Frontend: Running (PID: $frontend_pid)"
        else
            print_warning "Frontend: Not running"
        fi
    fi
    
    # Check backend
    if [ -f "backend.pid" ]; then
        local pid=$(cat backend.pid)
        if process_running $pid; then
            print_success "Backend: Running (PID: $pid)"
        else
            print_error "Backend: Not running (stale PID file)"
        fi
    else
        local backend_pid=$(pgrep -f "uvicorn main:app" || true)
        if [ -n "$backend_pid" ]; then
            print_success "Backend: Running (PID: $backend_pid)"
        else
            print_warning "Backend: Not running"
        fi
    fi
    
    # Check database containers
    if command_exists docker; then
        if docker ps | grep -q telemed-postgres; then
            print_success "PostgreSQL: Running"
        else
            print_warning "PostgreSQL: Not running"
        fi
        
        if docker ps | grep -q telemed-redis; then
            print_success "Redis: Running"
        else
            print_warning "Redis: Not running"
        fi
    else
        print_warning "Docker not available - cannot check database status"
    fi
    
    echo ""
}

# Function to show help
show_help() {
    echo "🏥 Telemed-CGM - Stop Script"
    echo "============================"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --status          Show status of all services"
    echo "  --clean           Clean cache and temporary files"
    echo "  --remove          Remove Docker containers"
    echo "  --help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                Stop all services"
    echo "  $0 --status       Show service status"
    echo "  $0 --clean        Stop and clean cache"
    echo "  $0 --remove       Stop and remove containers"
    echo ""
}

# Main function
main() {
    # Parse command line arguments
    local clean_cache=false
    local remove_containers=false
    local show_status_only=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --clean)
                clean_cache=true
                shift
                ;;
            --remove)
                remove_containers=true
                shift
                ;;
            --status)
                show_status_only=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    if [ "$show_status_only" = true ]; then
        show_status
        exit 0
    fi
    
    echo "🏥 Telemed-CGM - Stopping Application"
    echo "===================================="
    echo ""
    
    # Stop services
    stop_frontend
    stop_backend
    stop_database
    
    # Cleanup
    cleanup $([ "$clean_cache" = true ] && echo "--clean")
    
    echo ""
    print_success "All services stopped successfully!"
    echo ""
    echo "To start the application again, run: ./start.sh"
    echo ""
}

# Run main function
main "$@" 