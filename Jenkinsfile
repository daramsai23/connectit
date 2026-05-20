pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                echo 'Cloning repository from GitHub...'
                git branch: 'main',
                    url: 'https://github.com/daramsai23/connectit.git'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying to server...'
                sh '''
                    # Copy all HTML files to web directory
                    sudo cp -r *.html /var/www/html/
                    sudo cp -r *.js /var/www/html/ 2>/dev/null || true
                    echo "Deployment complete!"
                '''
            }
        }

        stage('Verify') {
            steps {
                echo 'Verifying deployment...'
                sh 'ls -la /var/www/html/'
            }
        }

    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}
