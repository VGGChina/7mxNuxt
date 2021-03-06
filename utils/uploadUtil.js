const uploadUtils = {
  today: new Date(),
  getYear() {
    return this.today.getFullYear()
  },
  getMonthAndDate() {
    // 获取当前月份，默认一月以 0 开始所以需要加一
    let month = this.today.getMonth() + 1
    let date = this.today.getDate()

    month = (month < 10 ? '0' + month : month)
    date = (date < 10 ? '0' + date : date)

    return month + '' + date
  },
  getAll() {
    return this.getYear() + '/' + this.getMonthAndDate()
  },
  getDir() {
    return 'photos/' + this.getYear() + '/' + this.getMonthAndDate() + '/'
  },
  getUploadData(bucket, baseDir, extension = 'jpeg') {
    return {
      type: 'uptoken',
      bucket: bucket,
      file_ext: extension,
      file_dir: baseDir + this.getAll()
    }
  }
}

export default uploadUtils
