pipeline {
    agent any

    tools {
        nodejs 'Node24'
    }

    environment {
        BUILD_VERSION = "${env.BUILD_NUMBER}"
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
                junit 'reports/test/junit.xml'
            }
        }



    }

    post {
        always {
            bat 'dir build /s' // DEBUG: list contents of build folder
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