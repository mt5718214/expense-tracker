module.exports = {
  generateMonth: () => {
    let months = []
    for (let i = 1; i < 13; i++) {
      months.push({ id: i, name: `${i}月份` })
    }
    return months
  }
}