package numbers

import (
	"fmt"
	"io"

	"github.com/sirupsen/logrus"
)

type Translator interface {
	Translate(string, string) (io.Reader, error)
}

type Storage interface {
	Save(path string, upload io.Reader) (string, error)
	Exists(path string) bool
	GetUrl(path string) string
}

type TranslationService struct {
	logger *logrus.Logger
	Translator
	Storage
}

func NewTranslationService(logger *logrus.Logger, translator Translator, storage Storage) *TranslationService {
	return &TranslationService{logger: logger, Translator: translator, Storage: storage}
}

func (t *TranslationService) Get(number string, languageCode string) (string, error) {
	path := fmt.Sprintf("%s/%s.mp3", languageCode, number)
	if exists := t.Exists(path); exists {
		url := t.GetUrl(path)
		return url, nil
	}
	f, err := t.Translate(number, languageCode)
	if err != nil {
		t.logger.Error(err)
		return "", err
	}
	url, err := t.Save(path, f)
	if err != nil {
		t.logger.Error(err)
		return "", err
	}
	return url, nil
}
