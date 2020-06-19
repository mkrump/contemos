package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/sirupsen/logrus"
)

type Getter interface {
	Get(number string, languageCode string) (string, error)
}

type Handler struct {
	logger *logrus.Logger
	Getter
}

func NewHandler(logger *logrus.Logger, getter Getter) *Handler {
	return &Handler{logger: logger, Getter: getter}
}

type ResponseBody struct {
	Number       string `json:"number"`
	LanguageCode string `json:"language_code"`
	Url          string `json:"url"`
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h.logger.Infof("request: %s", r.URL.Query())
	number := r.URL.Query().Get("number")
	if number == "" {
		h.logger.Errorf("missing number %v", r.URL.Query())
		err := errors.New("missing number")
		http.Error(w, err.Error(), 404)
		return
	}
	languageCode := r.URL.Query().Get("languageCode")
	if languageCode == "" {
		h.logger.Errorf("missing languageCode %v", r.URL.Query())
		err := errors.New("missing languageCode")
		http.Error(w, err.Error(), 404)
		return
	}
	url, err := h.Get(number, languageCode)
	if err != nil {
		h.logger.WithError(err).Error(fmt.Sprintf("error getting translation for number: %s, languageCode: %s", number, languageCode))
		http.Error(w, fmt.Sprint(url), 500)
		return
	}
	enc := json.NewEncoder(w)
	// https://github.com/golang/go/issues/14749
	enc.SetEscapeHTML(false)
	rb := ResponseBody{
		Number:       number,
		LanguageCode: languageCode,
		Url:          url,
	}
	err = enc.Encode(rb)
	if err != nil {
		h.logger.WithError(err).Error("error encoding response")
		http.Error(w, fmt.Sprint(url), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
}
