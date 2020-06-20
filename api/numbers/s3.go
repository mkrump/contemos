package numbers

import (
	"fmt"
	"io"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/sirupsen/logrus"
)

type S3 struct {
	bucket           string
	cloudfrontDomain string
	config           aws.Config
	logger           *logrus.Entry
}

func NewS3(bucket string, cloudfrontDomain string, config aws.Config) *S3 {
	l := NewDefaultLogger()
	standardFields := logrus.Fields{
		"package": "s3",
		"bucket":  bucket,
	}
	e := l.WithFields(standardFields)
	accessKey := os.Getenv("MY_AWS_ACCESS_KEY_ID")
	secret := os.Getenv("MY_AWS_SECRET_ACCESS_KEY")
	if accessKey != "" {
		creds := credentials.NewStaticCredentials(accessKey, secret, "")
		config.Credentials = creds
	}
	return &S3{bucket: bucket, cloudfrontDomain: cloudfrontDomain, config: config, logger: e}
}

func (s *S3) Save(path string, upload io.Reader) (string, error) {
	path, err := s.uploadFile(path, upload)
	if err != nil {
		s.logger.Error(err)
		return "", err
	}
	url := s.GetUrl(path)
	return url, nil
}

func (s *S3) Exists(path string) bool {
	sess, err := session.NewSession(&s.config)
	if err != nil {
		s.logger.Error(err)
		return false
	}
	svc := s3.New(sess)
	_, err = svc.HeadObject(&s3.HeadObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(path),
	})
	if err != nil {
		if aerr, ok := err.(awserr.Error); ok {
			switch aerr.Code() {
			case s3.ErrCodeNoSuchBucket, s3.ErrCodeNoSuchKey, "NotFound":
				return false
			}
		}
		//error other than expected not found errors
		s.logger.Error(err)
		s.logger.Error(path)
		return false
	}
	return true
}

func (s *S3) GetUrl(path string) string {
	return fmt.Sprintf("https://%s/%s", s.cloudfrontDomain, path)
}

func (s *S3) uploadFile(path string, upload io.Reader) (string, error) {
	sess, err := session.NewSession(&s.config)
	if err != nil {
		s.logger.Error(err)
		return "", err
	}
	uploader := s3manager.NewUploader(sess)
	result, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(path),
		Body:   upload,
	})
	if err != nil {
		s.logger.Error(err)
		return "", err
	}
	if result != nil {
		return path, nil
	}
	return "", nil
}
