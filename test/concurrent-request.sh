#!/bin/bash

URL="http://localhost:3000/user"

# Array of IANA timezones
timezones=("America/New_York" "Europe/London" "Asia/Tokyo" "Australia/Sydney" "Asia/Jakarta" "America/Los_Angeles" "Africa/Cairo" "Asia/Kolkata" "Europe/Paris" "America/Chicago")

# Function to generate a random timezone
get_random_timezone() {
  local random_index=$((RANDOM % ${#timezones[@]}))
  echo "${timezones[$random_index]}"
}

# Function to send POST request
send_post_user_request() {
  local email=$1
  local timezone=$2

  curl -X 'POST' \
    $URL \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d '{
    "email": "'"$email"'",
    "firstName": "Jane",
    "lastName": "Doe",
    "location": "Jakarta, Indonesia",
    "birthdayAt": "2000-10-11",
    "timezone": "'"$timezone"'"
  }'
}

# Send multiple requests in parallel
for i in {1..10}; do
  # Construct the email with an index
  EMAIL="jane_$i@gmail.com"

  # Get a random timezone
  TIMEZONE=$(get_random_timezone)

  send_post_user_request "$EMAIL" "$TIMEZONE" & # Execute in the background
done

# Wait for all requests to complete
wait

echo "All $request_count requests have been sent."
