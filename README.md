# FoodFlow - Premium Food Ordering & Delivery Application

FoodFlow is a complete production-style Food Ordering and Delivery Application built to demonstrate modern Full Stack Development and DevOps practices. 
It features a Spring Boot backend, React frontend, MySQL database, Redis caching, and full Kubernetes orchestration.

## Features
- **User Features:** Registration, JWT Login, browse restaurants, search food items, add to cart, checkout, track order status (PLACED, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED), and view order history.
- **Admin Features:** Add/Update/Delete restaurants and food items, view all system orders, and update order statuses via a dashboard.
- **Security:** Role-Based Access Control (USER, ADMIN) using Spring Security and JWT.
- **Caching:** Redis-backed caching for restaurant menus to optimize database calls.

## Architecture
```text
                 Internet
                     │
                     ↓
              Ingress Controller
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
   Frontend Service       Backend Service
          │                     │
          ↓                     ↓
   React Frontend Pods    Spring Boot Pods
                                │
                    ┌───────────┴───────────┐
                    ↓                       ↓
             MySQL StatefulSet       Redis Deployment
                    │
                    ↓
               PV and PVC
```
- **Frontend:** React application served by Nginx. Nginx routes `/api` requests to the Backend Service.
- **Backend:** Spring Boot application with layered architecture (Controller, Service, Repository, Entity). Uses Spring Data JPA to connect to MySQL and Spring Cache to connect to Redis.
- **Database:** MySQL configured as a StatefulSet with Persistent Volumes to ensure data survival across pod restarts.
- **Cache:** Redis deployment for high-performance temporary storage.

## Technology Stack
- **Frontend:** React, React Router, Axios, CSS (Outfit font, modern UI)
- **Backend:** Java 17, Spring Boot 3, Spring Data JPA, Spring Security, JWT, Spring Cache
- **Databases:** MySQL 8, Redis 7
- **DevOps:** Docker, Docker Compose, Kubernetes (Deployments, StatefulSets, Services, Ingress, Secrets, ConfigMaps, PV, PVC)

## Folder Structure
```text
foodflow/
├── frontend/
│   ├── src/             (React source code)
│   ├── public/          
│   ├── package.json     
│   ├── Dockerfile       (Multi-stage node + nginx build)
│   └── nginx.conf       (Nginx config for SPA and proxy)
├── backend/
│   ├── src/             (Spring Boot source code)
│   ├── Dockerfile       (Multi-stage maven + jdk build)
│   └── pom.xml          
├── k8s/
│   ├── mysql-stateful.yaml (PV, PVC, StatefulSet, Headless Service)
│   ├── config.yaml         (ConfigMap)
│   ├── secret.yaml         (Opaque Secrets)
│   ├── deployment.yaml     (Redis, Backend, Frontend Deployments)
│   ├── service.yaml        (ClusterIP Services)
│   └── ingress.yaml        (Ingress rules)
└── docker-compose.yml   (Local testing environment)
```

## Prerequisites
- Docker & Docker Compose
- Minikube or Docker Desktop (with Kubernetes enabled)
- `kubectl` CLI
- Java 17 & Node.js (for local development without Docker)

---

## Local Environment (Docker Compose)

You can run the entire application locally using Docker Compose without setting up Kubernetes.

### Build and Run
1. Navigate to the project root:
   ```bash
   cd foodflow
   ```
2. Build and start all services:
   ```bash
   docker-compose up --build -d
   ```
3. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8080/api/...`

### Docker Build Commands (Manual)
If you want to build the images manually:
```bash
docker build -t foodflow-backend:latest ./backend
docker build -t foodflow-frontend:latest ./frontend
```

---

## Kubernetes Deployment

To deploy FoodFlow to a Kubernetes cluster, follow these steps in exact order.

### 1. Create Namespace
```bash
kubectl create namespace food-app
```

### 2. Deploy Configuration and Secrets
```bash
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/config.yaml
```
- **Secrets:** We use `Opaque` Kubernetes secrets so we don't hardcode `MYSQL_ROOT_PASSWORD`, `JWT_SECRET`, etc. in our source code.
- **ConfigMap:** Stores non-sensitive configurations like `MYSQL_HOST` and `REDIS_HOST`.

### 3. Deploy Stateful Database (MySQL)
```bash
kubectl apply -f k8s/mysql-stateful.yaml
```
- **Persistent Storage:** A `PersistentVolume` and `PersistentVolumeClaim` are used. This ensures that if the MySQL pod crashes or restarts, your users and orders are not lost.
- **StatefulSet:** MySQL is deployed as a StatefulSet to provide stable network identity and ordered deployment.

### 4. Deploy Caching Layer (Redis) & Services
```bash
kubectl apply -f k8s/service.yaml
```
- We create `ClusterIP` services for all components, enabling stable DNS resolution (e.g. `mysql-service.food-app.svc.cluster.local`).

### 5. Deploy Applications
*Note: Ensure your local cluster has access to the built images, or push them to DockerHub and update `imagePullPolicy` in `deployment.yaml`.*
```bash
kubectl apply -f k8s/deployment.yaml
```
- **Redis Caching Explanation:** The backend uses `@Cacheable` and `@CacheEvict`. When a user requests a restaurant menu, Spring Boot checks Redis. If it's a Cache Miss, it queries MySQL, stores the result in Redis, and returns it. If a restaurant updates its menu, `@CacheEvict` flushes the cache.

### 6. Configure Ingress
```bash
kubectl apply -f k8s/ingress.yaml
```
- **Ingress Explanation:** The Ingress controller routes external traffic into the cluster. Traffic to `/api` goes to the backend, and `/` goes to the frontend.

### 7. Verification Commands
Check if all pods are running:
```bash
kubectl get pods -n food-app
kubectl get svc -n food-app
kubectl get pv,pvc -n food-app
```

---

## Scaling Commands
Kubernetes Services provide stable internal load balancing. To handle more traffic, scale the backend:
```bash
kubectl scale deployment backend --replicas=3 -n food-app
```
Because of the `backend-service`, traffic will be automatically distributed across all 3 backend pods. They will all connect seamlessly to the single `mysql-service` and `redis-service`.

---

## API Testing Examples

1. **Register a User:**
   ```bash
   curl -X POST http://localhost:8080/api/auth/register \
   -H "Content-Type: application/json" \
   -d '{"name":"John","email":"john@test.com","password":"pass","role":"USER"}'
   ```
2. **Login:**
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{"email":"john@test.com","password":"pass"}'
   ```
3. **Get Restaurants (Use the Token received from Login):**
   ```bash
   curl -X GET http://localhost:8080/api/restaurants \
   -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

---

## Troubleshooting

- **Pods in `CrashLoopBackOff`:** Check the logs using `kubectl logs <pod-name> -n food-app`. Usually indicates a failure to connect to MySQL or Redis. Verify that the services are up and `config.yaml` has the correct hostnames.
- **Cannot connect from Frontend to Backend:** Check your Nginx config. If running via Ingress, ensure your Ingress Controller (like Nginx Ingress) is enabled in Minikube (`minikube addons enable ingress`).
- **Database Data Wiped:** Ensure `mysql-stateful.yaml` successfully bound the PVC to a PV. Check `kubectl get pvc -n food-app`.
