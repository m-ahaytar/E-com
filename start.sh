#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

# Check for .env file
if [ ! -f .env ]; then
  echo "[!] .env not found. Copying .env.example..."
  if [ ! -f .env.example ]; then
    echo "[ERROR] .env.example not found. Please create a .env file with JWT_SECRET."
    exit 1
  fi
  cp .env.example .env
  echo "[!] Please edit .env and set a proper JWT_SECRET (min 32 chars)."
  exit 1
fi

# Validate JWT_SECRET
if ! grep -qE '^JWT_SECRET=.+' .env; then
  echo "[ERROR] JWT_SECRET is not set in .env"
  exit 1
fi

echo "[*] Cleaning up existing containers..."
docker compose down --remove-orphans 2>/dev/null || true

echo "[*] Building and starting services..."
docker compose up --build --remove-orphans -d

echo "[*] Waiting for services to start..."
sleep 5

echo ""
echo "[+] Services running:"
docker compose ps
echo ""
echo "[+] Frontend: http://localhost:3000"
echo "[+] API Gateway: http://localhost:8085"
echo ""
echo "[+] View logs: docker compose logs -f"
echo "[+] Stop: docker compose down"
