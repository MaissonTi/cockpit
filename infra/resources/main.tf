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

# Security Group para EC2
resource "aws_security_group" "nestjs_server_sg" {
  name_prefix = "nestjs-ec2-sg"

  lifecycle {
    prevent_destroy = true
  }

  ingress {
    description = "Allow SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

    ingress {
    description = "Allow HTTP"
    from_port   = 3333
    to_port     = 3333
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}



# Security Group para RDS
resource "aws_security_group" "postgres_sg" {
  name_prefix = "postgres-rds-sg"

  lifecycle {
    prevent_destroy = true
  }

  ingress {
    description = "Allow PostgreSQL"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


# RDS Instance
resource "aws_db_instance" "postgres" {
  engine             = "postgres"  
  instance_class     = "db.t4g.micro" # Free Tier
  allocated_storage  = 20 # Free Tier
  db_name            = "nestjsdb"
  username           = var.db_username
  password           = var.db_password
  publicly_accessible = true
  skip_final_snapshot = true

  backup_retention_period = 1
  multi_az                = false

  vpc_security_group_ids = [aws_security_group.postgres_sg.id]

  tags = {
    Name = "Postgres-Free-Tier"
  }
}