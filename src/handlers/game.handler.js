import { getGameAssets } from '../init/asset.js';
import { setStage, getStage, initializeStage } from '../models/stage.model.js';
import { calculateTotalScore } from '../utils/calculateTotalScore.js';
import { getuserItems } from '../models/item.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();
  initializeStage(uuid);
  // stages 배열의 0번째 = 첫번째 스테이지 & 클라이언트에서 현재 시작하는 시간을 받아 서버에 저장할 것
  setStage(uuid, stages.data[0].id, payload.timestamp);
  console.log('Stage: ', getStage(uuid));

  return { status: 'success ' };
};

export const gameEnd = (uuid, payload) => {
  // 클라 -> 서버로 게임종료시점과 점수를 전달할 것
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);
  const userItems = getuserItems(uuid);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for this user' };
  }

  const totalScore = calculateTotalScore(stages, gameEndTime, false, userItems);

  // 점수와 타임스탬프 검증 - 오차범위는 5 정도
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  console.log(`Total Score: ${totalScore}`);
  console.log(`Score for this stage : ${score}`);

  // DB에 저장한다고 가정하면 아래와 같이 쓸 수 있을 것
  // setResult(userId, score, timestamp)

  return { status: 'success ', message: 'Game ended' };
};
