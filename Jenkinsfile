pipeline {
    agent any

    tools {
        nodejs 'Node24'
        // Use the correct SonarScanner type from Jenkins
        sonarRunner 'SonarScanner'
    }

    environment {
        BUILD_VERSION = "${env.BUILD_NUMBER}"
        SONAR_TOKEN = credentials('SONAR_TOKEN')
    }

    triggers {
        pollSCM('H/5 * * * *') //five minutes
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
                withSonarQubeEnv('SonarCloud') {
                    bat 'sonar-scanner'
                }
            }
        }




    }

    post {
        always {
            archiveArtifacts artifacts: 'build/**', fingerprint: true
            archiveArtifacts artifacts: 'coverage/**', fingerprint: true
        }
        success {
            echo "Build succeeded!"
        }
        failure {
            echo "Build failed!"
        }
    }
}