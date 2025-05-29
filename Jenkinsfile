pipeline {
    agent any

    tools {
        nodejs 'Node24'
    }

    environment {
        BUILD_VERSION = "${env.BUILD_NUMBER}"
        SONAR_TOKEN = credentials('SONAR_TOKEN')
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    options {
        skipDefaultCheckout()
    }

    stages {
        stage('Build') {
            steps {
                git 'https://github.com/moniquesenjaya/crud-app.git'
                bat 'echo Building version %BUILD_VERSION%'
                bat 'npm install'
                bat 'npm run build'
            }
        }

        stage('Test') {
            steps {
                bat 'npm run test:ci'
                bat 'dir reports /s'
                junit 'reports/junit/js-test-results.xml'
            }
        }

        stage('Code Quality Analysis') {
            steps {
                withSonarQubeEnv('SonarQube Cloud') {
                    bat 'sonar-scanner'
                }
            }
        }

        stage('Security Analysis') {
            environment {
                SNYK_TOKEN = credentials('SNYK_TOKEN')
            }
            steps {
                bat 'npm install -g snyk'
                bat 'snyk auth %SNYK_TOKEN%'
                bat 'snyk test --json > snyk-report.json || exit 0'
                bat 'type snyk-report.json'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Building Docker image...'
                bat 'docker build -t crud-app .'

                echo 'Stopping existing container if running...'
                bat 'docker stop crud-app-container || exit 0'
                bat 'docker rm crud-app-container || exit 0'

                echo 'Running new container on port 3000...'
                bat 'docker run -d -p 3000:80 --name crud-app-container crud-app'
            }
        }

        stage('Release') {
            steps {
                echo 'Promoting to Production...'

                // Clean up old production container
                bat 'docker stop crud-app-prod-container || exit 0'
                bat 'docker rm crud-app-prod-container || exit 0'
                bat 'docker rmi crud-app-prod || exit 0'

                // Tag image for production
                bat 'docker tag crud-app crud-app-prod'

                // Run new production container on port 4000
                bat 'docker run -d -p 4000:80 --name crud-app-prod-container crud-app-prod'
            }
}

    }

    post {
        always {
            archiveArtifacts artifacts: 'build/**', fingerprint: true
            archiveArtifacts artifacts: 'coverage/**', fingerprint: true
            archiveArtifacts artifacts: 'snyk-report.json', fingerprint: true
        }
        success {
            echo "Build succeeded!"
        }
        failure {
            echo "Build failed!"
        }
    }
}
