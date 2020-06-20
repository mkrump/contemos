package numbers

import (
	"fmt"
	"testing"

	"github.com/sirupsen/logrus"

	"github.com/stretchr/testify/suite"
)

type TranslationServiceTestSuite struct {
	*logrus.Logger
	suite.Suite
}

type FakeHandler struct {
}

func (f FakeHandler) Get(number string, languageCode string) (string, error) {
	return "/url/path/file", nil
}

func TestTranslationServiceSuite(t *testing.T) {
	l := NewDefaultLogger()
	s := &TranslationServiceTestSuite{Logger: l}
	suite.Run(t, s)
}

func (t *TranslationService) TestTTSIntegrationTranslate() {
	fh := FakeHandler{}
	fmt.Println(fh)
	//TODO TestTTSIntegrationTranslate
}
