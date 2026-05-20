pipeline {
    agent any
    stages {
        stage('Clone') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/daramsai23/connectit.git'
            }
        }
        stage('Deploy') {
            steps {
                sh 'sudo cp -r *.html /var/www/html/'
                sh 'sudo cp *.js /var/www/html/ || true'
                echo 'Deployed!'
            }
        }
        stage('Verify') {
            steps {
                sh 'ls -la /var/www/html/'
            }
        }
    }
    post {
        success { echo 'SUCCESS!' }
        failure { echo 'FAILED!' }
    }
}
