package main

import (
	"fmt"
	"os"
	"time"
)

var logsDir string

func init() {
	updateLogsDirWithDate()
}

func updateLogsDirWithDate() {
	now := time.Now()
	year := now.Format("2006")
	month := now.Format("01")
	day := now.Format("02") // what are these copilot-generated numbers for formatting?
	logsDir = fmt.Sprintf(dataDir+"/logs/%s/%s/%s", year, month, day)
	if _, err := os.Stat(logsDir); os.IsNotExist(err) {
		os.MkdirAll(logsDir, 0700)
	}
}

// func addLog(loggerID string,
