#!/usr/bin/env bash
if ! aws s3api head-bucket --bucket "${S3_TEST_BUCKET}" --region "${S3_TEST_REGION}"; then
  aws s3 mb s3://"${S3_TEST_BUCKET}" --region "${S3_TEST_REGION}"
  aws s3 cp api/storage/testdata s3://"${S3_TEST_BUCKET}" --recursive
fi
