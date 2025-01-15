output "nestjs_server_sg_id" {
  value       = aws_security_group.nestjs_server_sg.id
  description = "ID do Security Group associado ao EC2 para NestJS"
}

output "postgres_sg_id" {
  value       = aws_security_group.postgres_sg.id
  description = "ID do Security Group associado ao banco de dados PostgreSQL"
}

output "rds_endpoint" {
  value       = aws_db_instance.postgres.endpoint
  description = "Endpoint do banco de dados PostgreSQL"
}