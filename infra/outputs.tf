output "bucket_name" {
  value = aws_s3_bucket.web_bucket.id
}

output "api_public_ip" {
  value = aws_instance.api_instance.public_ip
}
