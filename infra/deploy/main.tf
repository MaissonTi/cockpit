terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "meu-terraform-bucket"
    key            = "resources/terraform.tfstate"
    region         = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "nestjs_server" {
  ami           = "ami-0c02fb55956c7d316" # Amazon Linux 2 Free Tier
  instance_type = "t2.micro"
  vpc_security_group_ids = [
    var.nestjs_server_sg_id
  ]

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name = "NestJS Server"
  }

  user_data = <<-EOT
    #!/bin/bash
    set -e
    sudo yum update -y
    sudo yum install -y gcc-c++ make
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs git
    sudo npm install -g pm2

    # Clonar o projeto e configurar o Nest.js
    git clone https://github.com/MaissonTi/cockpit.git /home/ec2-user/nestjs-app
    cd /home/ec2-user/nestjs-app/apps/api
    npm install
    npm run build

    # Configurar o banco de dados
    echo "DATABASE_URL=postgresql://${var.rds_endpoint}:5432/nestjsdb" > .env

    # Rodar o backend
    pm2 start dist/main.js --name nestjs-app
    pm2 save
  EOT
}

output "instance_ip" {
  value = aws_instance.nestjs_server.public_ip
}
