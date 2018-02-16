#!/bin/bash
#set -e

HOST="localhost:3001"

function parseId() {
	echo ${1} | grep -Po '"id":.*?[^\\]",' | awk -F':' '{print $2}' | perl -pe 's/"text"://; s/^"//; s/",$//'
}

function getInfo() {
	./wonderq -h ${HOST} -i
	echo ""
}

echo "Put a message!"
./wonderq -h ${HOST} -p '{"key1":"value1", "key2":"value2"}'

getInfo

echo "Wait 2 seconds"
sleep 2s

getInfo

echo "Get a message"
MESSAGE=$(./wonderq -h ${HOST} -g)
echo "Message received: ${MESSAGE}"
ID1=$(parseId "${MESSAGE}")

getInfo

echo "Sleep 12 seconds"
sleep 12s

getInfo

echo "Get a message"
MESSAGE=$(./wonderq -h ${HOST} -g)
echo "Message received: ${MESSAGE}"
ID1=$(parseId "${MESSAGE}")

getInfo

echo "Sleep 2 seconds"
sleep 2s

echo "Mark message ${ID1} complete"
./wonderq -h ${HOST} -c ${ID1}

getInfo
