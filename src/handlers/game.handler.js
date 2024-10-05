import { getGameAssets } from '../init/asset.js';
import { setStage, getStage, clearStage } from '../models/stage.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();
  clearStage(uuid);
  // stages 배열의 0번째 = 첫번째 스테이지 & 클라이언트에서 현재 시작하는 시간을 받아 서버에 저장할 것
  setStage(uuid, stages.data[0].id, payload.timestamp);
  console.log('Stage: ', getStage(uuid));

  return { status: 'success ' };
};

export const gameEnd = (uuid, payload) => {
  // 클라 -> 서버로 게임종료시점과 점수를 전달할 것
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);

  if (stages.length) {
    return { status: 'fail', message: 'No stages found for this user' };
  }
  // 각 스테이지의 지속시간을 계산하여 총점수 계산
  let totalscore = 0;

  stages.forEach((stage, index) => {
    // 스테이지별 끝나는 시간
    let stageEndTime;
    // 인덱스가 맨끝이라면 최고스테이지란 얘기니까 이때의 endTime = 게임 끝나는 시간
    if (index === stages.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      // 반복문이 끝나지 않았다면 최고스테이지 아니란 얘기니까 다음 스테이지의 타임스탬프 내뱉어줘
      stageEndTime = stages[index + 1].timestamp;
    }

    // 그 스테이지에서 얼마동안 있었냐?
    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    // 1초당 1점이라 가정하면 그냥 더한다
    totalscore += stageDuration;
    // 그러면, 1초당 1점이 아니라면? 있던 시간 * 스테이지별 점수를 해줘서 더해야 할것
  });

  // 점수와 타임스탬프 검증 - 오차범위는 5 정도
  if (Math.abs(score - totalscore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  // DB에 저장한다고 가정하면 아래와 같이 쓸 수 있을 것
  // setResult(userId, score, timestamp)
  return { status: 'success ', message: 'Game ended' };
};
