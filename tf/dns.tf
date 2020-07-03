
data "aws_route53_zone" zone {
  name = "${local.domain}."
}

data "aws_acm_certificate" cert {
  domain   = "blog.stein.wtf"
  provider = "aws.use1"
}

resource "aws_route53_record" "root" {
  zone_id = data.aws_route53_zone.zone.id
  name    = "blog.${local.domain}"
  type    = "A"

  alias {
    name                   = replace(aws_cloudfront_distribution.cf_distribution.domain_name, "/[.]$/", "")
    zone_id                = aws_cloudfront_distribution.cf_distribution.hosted_zone_id
    evaluate_target_health = true
  }

  depends_on = [aws_cloudfront_distribution.cf_distribution]
}
