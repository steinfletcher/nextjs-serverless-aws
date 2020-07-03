provider "aws" {
  profile = "default"
  region  = "eu-west-1"
}

provider "aws" {
  region = "us-east-1"
  alias  = "use1"
}

data "aws_caller_identity" "current" {}

locals {
  domain           = "stein.wtf"
  web_ui_origin_id = "blog_lambda_ui_origin"
}

resource "aws_cloudfront_distribution" "cf_distribution" {
  enabled         = true
  is_ipv6_enabled = true

  aliases = ["blog.${local.domain}"]

  default_cache_behavior {
    allowed_methods = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]

    cached_methods = ["GET", "HEAD"]

    target_origin_id = "apigw"

    forwarded_values {
      query_string = true

      cookies {
        forward = "all"
      }
    }

    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  origin {
    domain_name = replace(aws_apigatewayv2_api.blog.api_endpoint, "/^https?://([^/]*).*/", "$1")

    origin_id = "apigw"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn            = data.aws_acm_certificate.cert.arn
    ssl_support_method             = "sni-only"
    cloudfront_default_certificate = false
  }

  depends_on = [aws_lambda_function.blog_lambda]
}

resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {}
