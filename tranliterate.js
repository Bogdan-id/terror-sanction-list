/* Eng - Ukr */
module.exports = {
  engToUkr: {
    'A': 'А',
    'a': 'а',
    'B': 'Б',
    'b': 'б',
    'V': 'В',
    'v': 'в',
    'W': 'В',
    'w': 'в',
    'H': 'Г',
    'h': 'г',
    'G': 'Ґ',
    'g': 'ґ',
    'j': 'дж',
    'J': 'Дж',
    'D': 'Д',
    'd': 'д',
    'E': 'Е',
    'e': 'е',
    'Z': 'З',
    'z': 'з',
    'Y': 'И',
    'y': 'и',
    'I': 'І',
    'i': 'і',
    'Y': 'Й',
    'y': 'й',
    'K': 'К',
    'k': 'к',
    'Q': 'К',
    'q': 'к',
    'L': 'Л',
    'l': 'л',
    'M': 'М',
    'm': 'м',
    'N': 'Н',
    'n': 'н',
    'O': 'О',
    'o': 'о',
    'P': 'П',
    'p': 'п',
    'R': 'Р',
    'r': 'р',
    'S': 'С',
    's': 'с',
    'T': 'Т',
    't': 'т',
    'U': 'У',
    'u': 'у',
    'F': 'Ф',
    'f': 'ф'
  },

  complex: [
    {'SHCH': 'Щ'},
    {'Shch': 'Щ'},
    {'shch': 'щ'},
    {'YE': 'Є'},
    {'Ye': 'Є'},
    {'ye': 'є'},
    {'ZH': 'Ж'},
    {'Zh': 'Ж'},
    {'zh': 'ж'},
    {'YI': 'Ї'},
    {'Yi': 'Ї'},
    {'yi': 'ї'},
    {'KH': 'Х'},
    {'Kh': 'Х'},
    {'kh': 'х'},
    {'TS': 'Ц'},
    {'Ts': 'Ц'},
    {'ts': 'ц'},
    {'CH': 'Ч'},
    {'Ch': 'Ч'},
    {'ch': 'ч'},
    {'SH': 'Ш'},
    {'Sh': 'Ш'},
    {'sh': 'ш'},
    {'YU': 'Ю'},
    {'Yu': 'Ю'},
    {'yu': 'ю'},
    {'YA': 'Я'},
    {'Ya': 'Я'},
    {'ya': 'я'},
  ],

  transliterate: function (string) {
    if(!string) return
    for (let v of this.complex) {
      let re = new RegExp(Object.keys(v)[0], 'g')
      string = string.replace(re, Object.values(v)[0])
    }

    return string.split('').map(char => { 
      return this.engToUkr[char] || char; 
    }).join("");
  },

  capitalize(str) {
    if(str) {
      str = str.split(" ")

      return str.map(word => {
        return (word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).trim()
      }).join(" ")
    } else return ""
  },
}