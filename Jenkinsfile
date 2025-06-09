pipeline {
  agent any

  environment {
    DOCKER_HUB_USER = 'yourdockerhub'
    JWT_SECRET = 'prodsecret'
    DATABASE_URL = 'postgres://postgres:postgres@postgres:5432/inventory_db'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Test Backend') {
      steps {
        dir('server') {
          sh 'npm install'
          sh 'npx prisma generate'
          sh 'npm run test'
        }
      }
    }

    stage('Install & Test Frontend') {
      steps {
        dir('client') {
          sh 'npm install'
          sh 'npm run test -- --watchAll=false'
        }
      }
    }

    stage('SonarQube Scan') {
      steps {
        withSonarQubeEnv('MySonarQube') {
          sh 'sonar-scanner -Dsonar.projectKey=store-inventory'
        }
      }
    }

    stage('Docker Build & Push') {
      steps {
        script {
          docker.build("${DOCKER_HUB_USER}/store-inventory-server", './docker/server.Dockerfile').push()
          docker.build("${DOCKER_HUB_USER}/store-inventory-client", './docker/client.Dockerfile').push()
        }
      }
    }

    stage('Deploy to K8s') {
      steps {
        sh 'kubectl apply -f k8s/'
      }
    }
  }
}
