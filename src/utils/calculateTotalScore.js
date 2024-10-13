import { getGameAssets } from '../init/asset.js';

// 스테이지 지속 시간을 기반으로 총 점수를 계산하는 함수
export const calculateTotalScore = (stages, gameEndTime, isMoveStage, userItems) => {
  let totalScore = 0;

  const { stages: stageData, items: itemData } = getGameAssets();
  const stageTable = stageData.data;

  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      // 다음 스테이지의 시작시간을 현재 스테이지의 종료시간으로 사용
      stageEndTime = stages[index + 1].timestamp;
    }

    let stageDuration = (stageEndTime - stage.timestamp) / 100;

    const stageInfo = stageTable.find((s) => s.id === stage.id);
    const scorePerSecond = stageInfo ? stageInfo.scorePerSecond : stageTable[0].id;

    if (!isMoveStage && index === stages.length - 1) {
      stageDuration = Math.floor(stageDuration);
    } else {
      stageDuration = Math.round(stageDuration);
    }

    totalScore += stageDuration * scorePerSecond;
  });

  userItems.forEach((userItem) => {
    const item = itemData.data.find((item) => item.id === userItem.id);
    if (item) {
      totalScore += item.score;
    }
  });

  return totalScore;
};
