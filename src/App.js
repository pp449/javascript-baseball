const { Random, Console } = require('@woowacourse/mission-utils');

class App {
  constructor() {
    this.computerNumbers = [];
    this.userNumbers = [];
  }

  getRandomNumbers() {
    this.computerNumbers = Random.pickUniqueNumbersInRange(1, 9, 3);
  }

  checkInputError(numbers) {
    const newNumbers = new Set(numbers); // 중복된 숫자를 찾기위해 사용
    if (isNaN(numbers)) {
      throw '숫자 이외의 입력';
    }

    if (numbers.length !== 3) {
      throw '3자리 숫자 이외의 입력';
    }

    if (newNumbers.size !== 3) {
      throw '중복된 숫자 입력';
    }
  }

  setUserNumber(numbers) {
    while (numbers !== 0) {
      this.userNumbers.push(numbers % 10);
      numbers = parseInt(numbers / 10);
    }

    this.userNumbers.reverse();
  }

  printGameResult(gameResult) {
    if (gameResult[2] === 3) {
      Console.print('낫싱');
      return;
    }
    let text = '';

    for (let i = 0; i < 2; i++) {
      if (gameResult[i] === 0) continue;

      text += gameResult[i];
      switch (i) {
        case 0:
          text += '볼 ';
          break;
        case 1:
          text += '스트라이크';
      }
    }

    Console.print(text);
  }

  calculateGameResult(result) {
    const gameResult = [];
    for (let i = 100; i !== 0; i = parseInt(i / 10)) {
      gameResult.push(parseInt(result / i));
      result %= i;
    }

    this.printGameResult(gameResult);
    return gameResult[1] === 3 ? true : false;
  }

  gameSet() {
    Console.print('3개의 숫자를 모두 맞히셨습니다! 게임 종료');
    Console.readLine(
      '게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요.',
      (num) => {
        if (num === '1') {
          return this.play();
        }
        if (num === '2') {
          process.exit();
        }
      },
    );
  }

  discriminationStrikeOrBall() {
    const result = this.userNumbers.reduce((acc, cur, i) => {
      if (this.computerNumbers.includes(cur)) {
        if (this.computerNumbers[i] === cur) return acc + 10;
        else return acc + 100;
      }

      return acc + 1;
    }, 0);

    const isGameSet = this.calculateGameResult(result);
    if (isGameSet) return this.gameSet();
    return this.userInputNumber();
  }

  userInputNumber() {
    try {
      Console.readLine('숫자를 입력해주세요 : ', (numbers) => {
        this.checkInputError(numbers);
        this.setUserNumber(numbers);
        return this.discriminationStrikeOrBall();
      });
    } catch (e) {
      console.error(e);
    }
  }

  gameStart() {
    Console.print('숫자 야구 게임을 시작합니다.');
    this.getRandomNumbers();
    this.userInputNumber();
  }

  play() {
    this.gameStart();
  }
}

const baseball = new App();
baseball.play();

module.exports = App;
