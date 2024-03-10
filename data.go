package main

import (
	"encoding/json"
	"os"
)

type UserData struct {
	Settings []bool
	BlockStr string
	Internet bool
	LoggerID string
	Other    []string
}

type AccountData struct {
	Users     map[string]UserData
	Devices   map[string]([]string)
	OtherData []string
}

// username -> [id, passwordHash]
type LoginsData map[string]([]string)

const (
	dataDir     = "data"
	accountsDir = dataDir + "/accounts"
	loginsFile  = dataDir + "/logins.json"
)

/*
Data storage to disk:
- accountsDir/<id>.json -> AccountData
- loginsFile -> LoginsData
*/

func init() {
	if _, err := os.Stat(dataDir); os.IsNotExist(err) {
		os.Mkdir(dataDir, 0700)
	}
	if _, err := os.Stat(accountsDir); os.IsNotExist(err) {
		os.Mkdir(accountsDir, 0700)
	}
	if _, err := os.Stat(loginsFile); os.IsNotExist(err) {
		os.Create(loginsFile)
	}
}

func saveJSON(filename string, data interface{}) {
	file, err := os.Create(filename)
	if err != nil {
		panic(err)
	}
	defer file.Close()
	enc := json.NewEncoder(file)
	enc.Encode(data)
}

func loadJSON(filename string, data interface{}) {
	file, err := os.Open(filename)
	if err != nil {
		panic(err)
	}
	defer file.Close()
	dec := json.NewDecoder(file)
	dec.Decode(data)
}

func SaveAccountData(id string, data AccountData) {
	saveJSON(accountsDir+"/"+id+".json", data)
}

func LoadAccountData(id string) AccountData {
	var data AccountData
	loadJSON(accountsDir+"/"+id+".json", &data)
	return data
}

func SaveLoginsData(data LoginsData) {
	saveJSON(loginsFile, data)
}

func LoadLoginsData() LoginsData {
	var data LoginsData
	loadJSON(loginsFile, &data)
	return data
}
