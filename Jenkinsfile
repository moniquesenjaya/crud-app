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

    }

    posts {
        always {
            archiveArtifacts artifacts: 'dist/**', fingerprint: true
        }
        success {
            echo "Build succeeded!"
        }
        failure {
            echo "Build failed!"
        }
    }
}