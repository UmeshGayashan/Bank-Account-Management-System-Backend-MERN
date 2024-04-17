pipeline {
    agent any
    
    environment {
        NODEJS_HOME = tool 'NodeJS' // Assuming NodeJS is configured in Jenkins tools
        PATH = "${env.NODEJS_HOME}/bin:${env.PATH}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Checkout your repository
                git 'https://github.com/UmeshGayashan/Bank-Account-Management-System-Backend-MERN/'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // Install Node.js dependencies
                sh 'npm install'
            }
        }
        
        stage('Lint Code') {
            steps {
                // No linting script defined in package.json, skipping linting
            }
        }
        
        stage('Start Application') {
            steps {
                // Start the application using nodemon
                sh 'npm start'
            }
        }
    }
    
    post {
        success {
            // Add any success post-build actions here
            // For example, sending notifications
            echo 'Application started successfully!'
        }
        
        failure {
            // Add any failure post-build actions here
            // For example, sending notifications
            echo 'Failed to start application!'
        }
    }
}
