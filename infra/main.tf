provider "aws" {
  region = "us-east-1" # Substitua pela sua região
}

# S3 Bucket para o Web
resource "aws_s3_bucket" "web_bucket" {
  bucket = "cockpit-web-${random_id.suffix.id}"
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  tags = {
    Name = "WebBucket"
  }
}

resource "random_id" "suffix" {
  byte_length = 4
}

# EC2 para a API
resource "aws_instance" "api_instance" {
  ami           = "ami-0c02fb55956c7d316" # Amazon Linux 2 (substitua pela imagem necessária)
  instance_type = "t2.micro"

  tags = {
    Name = "ApiServer"
  }

  user_data = <<-EOF
              #!/bin/bash
              curl -fsSL https://get.docker.com -o get-docker.sh
              sh get-docker.sh
              amazon-linux-extras install -y nginx1
              systemctl start nginx
              EOF
