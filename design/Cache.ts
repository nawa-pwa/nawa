

interface CacheDBKeys {
    url: string, // keyPath
    usage: number, //index, usage times
    fileDate: number, // last-modified timestamp
    date: number, // timestamps
    // size: number, // Bytes, TODO: size = request.size + response.size
    method: string, // get | put | post | any
}

