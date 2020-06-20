package numbers

import (
	"bytes"
	"io/ioutil"
	"log"
	"os"
	"testing"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/stretchr/testify/suite"
)

type S3TestSuite struct {
	suite.Suite
	aws.Config
	S3Bucket         string
	CloudfrontDomain string
}

func TestDownloaderSuite(t *testing.T) {
	s := &S3TestSuite{}
	testBucket := os.Getenv("S3_TEST_BUCKET")
	if testBucket == "" {
		t.Fatal("Need to set env var S3_TEST_BUCKET")
	}
	s.S3Bucket = testBucket
	region := os.Getenv("S3_TEST_REGION")
	if region == "" {
		t.Fatal("Need to set env var S3_TEST_REGION")
	}
	s.Region = &region
	domain := os.Getenv("CLOUDFRONT_DOMAIN")
	if domain == "" {
		t.Fatal("Need to set env var CLOUDFRONT_DOMAIN")
	}
	s.CloudfrontDomain = domain
	log.Println("S3_TEST_BUCKET: ", testBucket)
	log.Println("S3_TEST_REGION: ", region)
	log.Println("CLOUDFRONT_DOMAIN: ", domain)
	suite.Run(t, s)
}

func (suite *S3TestSuite) TestS3IntegrationUploadFile() {
	f, err := ioutil.ReadFile("./testdata/600.jpg")
	reader := bytes.NewReader(f)
	suite.NoError(err)
	config := aws.Config{Region: aws.String(*suite.Region)}
	s := NewS3(suite.S3Bucket, suite.CloudfrontDomain, config)

	_, err = s.Save("600.jpg", reader)
	suite.NoError(err)

	exists := s.Exists("600.jpg")
	suite.NoError(err)
	suite.True(exists)

	url := s.GetUrl("600.jpg")
	suite.Contains(url, "600.jpg")
}
