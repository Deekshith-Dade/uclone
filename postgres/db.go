package db

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
)

var Connection *sql.DB

func InitDB() {
	connStr := fmt.Sprintf(
			"user=%s password=%s host=%s port=%d dbname=%s sslmode=disable",
		"postgres", "mysecretpassword", "db", 5432, "postgres",
		)

	log.Printf("Connectiong to %s\n", connStr)

	var err error
	Connection, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Error opening database: %v", err)	
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	if err := Connection.PingContext(ctx); err != nil {
		Connection.Close()
		log.Fatalf("Error pinging: %v", fmt.Errorf("db.Ping: %w", err))
	}

	log.Println("database connected")
}
