exports.StringToQuery = (query) => { //parses query portion of url
    query = query.split("&"); //split url query at ampersands to separate out key/val pairs
    var queryObj = {}; //create empty dict to store key/values
    query.forEach(queryChunk => { //for each chunk of url query
        keyVal = queryChunk.split("="); //split query chunk into a key (0) and a value (1)
        queryObj[keyVal[0]] = keyVal[1]; //add the key and value into queryObj
    })
    return queryObj; //once everything is parsed, return queryObj
}

exports.sendJSONObj = (res, status, data) => {
    res.writeHead(status, {"Content-Type": "application/json"}); //write the head with status and content type
    res.write(JSON.stringify(data)); //write the stringified json obj
    res.end(); //end
}