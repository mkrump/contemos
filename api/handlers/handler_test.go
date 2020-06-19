package handlers

import (
	"context"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/apex/gateway"
	"github.com/mkrump/numbers/api/loggers"
	"github.com/sirupsen/logrus"

	"github.com/aws/aws-lambda-go/events"
	"github.com/stretchr/testify/suite"
)

type HandlerTestSuite struct {
	suite.Suite
}

func TestHandlerSuite(t *testing.T) {
	hs := &HandlerTestSuite{}
	suite.Run(t, hs)
}

type MockGetter struct {
}

func (m MockGetter) Get(number string, languageCode string) (string, error) {
	return "https://path.s3.amazonaws.com/es/1.mp3", nil
}

func (suite *HandlerTestSuite) TestHandler() {
	l := loggers.NewDefaultLogger()
	logrus.WithField("package", "handler")
	h := Handler{
		logger: l,
		Getter: MockGetter{},
	}
	expected := ResponseBody{
		Number:       "1",
		LanguageCode: "es",
		Url:          "https://path.s3.amazonaws.com/es/1.mp3",
	}
	rb := ResponseBody{}

	//test handler including conversion from api gateway event
	//converted via gateway package
	gatewayRequest := &events.APIGatewayProxyRequest{}
	err := json.Unmarshal([]byte(`{"queryStringParameters": {"number":"1", "languageCode": "es"}}`), gatewayRequest)
	suite.NoError(err)
	rr := httptest.NewRecorder()
	request, err := gateway.NewRequest(context.Background(), *gatewayRequest)
	suite.NoError(err)

	h.ServeHTTP(rr, request)
	err = json.NewDecoder(rr.Body).Decode(&rb)
	suite.NoError(err)

	suite.Equal(rr.Code, 200)
	suite.Equal(rr.Header().Get("Content-Type"), "application/json")
	suite.Equal(expected, rb)
}
