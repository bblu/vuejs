import SparkMD5 from 'spark-md5'

export function generatorFileMd5(file) {
  /**
      * 生成MD5
      */
  const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
  // file = this.files[0],
  const chunkSize = 2097152 // Read in chunks of 2MB
  const chunks = Math.ceil(file.size / chunkSize)
  let currentChunk = 0
  const spark = new SparkMD5.ArrayBuffer()
  const fileReader = new FileReader()
  fileReader.onload = function(e) {
    // console.log('read chunk nr', currentChunk + 1, 'of', chunks)
    spark.append(e.target.result) // Append array buffer
    currentChunk++

    if (currentChunk < chunks) {
      loadNext()
    } else {
      // console.info('computed hash', spark.end())  // spark.end(): 文件 MD5值生成完成
      console.log(spark.end())
    }
  }

  fileReader.onerror = function() {
    console.warn('fileReader.onerror is error')
  }

  function loadNext() {
    const start = currentChunk * chunkSize
    const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
  }

  loadNext()
}
