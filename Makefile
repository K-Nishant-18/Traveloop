.PHONY: help build up down restart logs db-logs backend-logs frontend-logs clean

help:
	@echo "Available Traveloop commands:"
	@echo "  make build    - Build all Docker containers"
	@echo "  make up       - Start all services (detached)"
	@echo "  make down     - Stop all services"
	@echo "  make restart  - Restart all services"
	@echo "  make logs     - View logs of all services"
	@echo "  make clean    - Stop services and remove persistent volumes"

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

restart: down up

logs:
	docker compose logs -f

db-logs:
	docker compose logs -f mysql-db

backend-logs:
	docker compose logs -f backend

frontend-logs:
	docker compose logs -f frontend

clean:
	docker compose down -v
