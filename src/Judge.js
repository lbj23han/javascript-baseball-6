import { MissionUtils, Console } from "@woowacourse/mission-utils";

class Judge {
  constructor(App) {
    this.app = App;
  }

  randomNumber() {
    const COMPUTER_NUM = [];

    while (COMPUTER_NUM.length < 3) {
      const Numbers = MissionUtils.Random.pickNumberInRange(1, 9);
      if (!COMPUTER_NUM.includes(Numbers)) COMPUTER_NUM.push(Numbers);
    }

    return COMPUTER_NUM;
  }

  userNumber(message) {
    return Console.readLineAsync(message);
  }

  async validNumber() {
    const userNumber = await this.userNumber(`숫자를 입력해주세요 : `);

    if (!/^[1-9]{3}$/.test(userNumber)) {
      Console.print("[ERROR] 숫자가 잘못된 형식입니다.");
      this.app.PlayerOn = false;
      throw new Error("[ERROR] 숫자가 잘못된 형식입니다.");
    }

    return Array.from(userNumber, Number);
  }

  compareScore(data) {
    let strike = 0;
    let ball = 0;

    const { me, com } = data;

    com.forEach((el, idx) => {
      if (el === me[idx]) strike++;
      else if (me.includes(el)) ball++;
    });

    const score = this.scoreTable({ strike, ball, com });

    return score;
  }

  scoreTable(data) {
    const { strike, ball, com } = data;

    if (!strike && !ball) {
      Console.print("낫싱");

      return { state: "LOSE", com };
    }

    if (strike !== 3) {
      if (ball === 0) {
        Console.print(`${strike}스트라이크`);

        return { state: "LOSE", com };
      }

      if (strike === 0) {
        Console.print(`${ball}볼`);

        return { state: "LOSE", com };
      }

      Console.print(`${ball}볼 ${strike}스트라이크`);

      return { state: "LOSE", com };
    }

    if (strike === 3) {
      Console.print("3스트라이크");

      return "WIN";
    }
  }

  async gameStatus() {
    Console.print("3개의 숫자를 모두 맞히셨습니다! 게임 종료");

    try {
      const USER_NUM = await this.userNumber(
        "게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요."
      );

      if (USER_NUM === "1") {
        this.app.PlayerOn = true;
        this.app.Computer = this.randomNumber();

        return;
      }

      if (USER_NUM === "2") {
        Console.print("게임 종료");
        this.app.PlayerOn = false;

        return;
      }

      throw new Error("[ERROR] 1 또는 2를 입력해주세요.");
    } catch (error) {
      throw Error(error.message);
    }
  }
}

export default Judge;