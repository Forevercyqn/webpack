class Person {
  name = 'test'
  age = '26'
    email = 'xxx@xx.com'

  info() {
    return {
      name: this.name,
      age: this.age
    }
  }
}

module.exports = Person