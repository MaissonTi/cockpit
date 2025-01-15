variable "db_username" {
  description = "Username do banco de dados"
  type        = string
}

variable "db_password" {
  description = "Senha do banco de dados"
  type        = string
  sensitive   = true
}

variable "repository_url" {
  description = "URL do repositório Git"
  type        = string
  default     = "https://github.com/MaissonTi/cockpit.git"
}

variable "branch" {
  description = "Branch do repositório a ser clonado"
  type        = string
  default     = "main"
}

variable "nestjs_server_sg_id" {
  description = "ID do Security Group associado ao EC2 para NestJS"
  type        = string
}

variable "postgres_sg_id" {
  description = "ID do Security Group associado ao banco de dados PostgreSQL"
  type        = string
}

variable "rds_endpoint" {
  description = "Endpoint do banco de dados PostgreSQL"
  type        = string
}