import { getGameAssets } from '../init/asset.js';

export const calculateTotalScore = (stages, gameEndTime, isMoveStage, userItems) => {
  let totalScore = 0;

  const { stages: stageData, items: itemData } = getGameAssets();
  const stageTable = stageData.data;
  console.log('stageTable 잘 나오나?:', stageTable);

  stages.forEach((stage, index) => {
    let stageEndTime;
    // 마지막 스테이지라면 스테이지 종료시간 = 게임종료시간
    if (index === stages.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      // 다음 스테이지의 시작시간 = 현재 스테이지의 종료시간으로 사용
      stageEndTime = stages[index + 1].timestamp;
    }

    // 스테이지 지속시간 - 1초 단위로 써주기 위해 1000을 나눠줌 (미리세컨드 단위라서)
    let stageDuration = (stageEndTime - stage.timestamp) / 1000;

    // 현재 stage의 scorePerSecond를 가져옴
    const stageInfo = stageTable.find((s) => s.id === stage.id);
    const scorePerSecond = stageInfo ? stageInfo.scorePerSecond : stageTable[0].id;

    // 이거 왜 해주냐면 클라에서 4.998초에 보냈을 때 서버에서 5.002초에 받는다면 초가 달라지기 때문에 간극이 생길 수밖에 없다
    if (!isMoveStage && index === stages.length - 1) {
        // 마지막 스테이지인 경우 버림 처리 -> 왜 버려요? 9.9점 같은걸 보여줄 순 없으니까 끝자리 정리하는 것
      stageDuration = Math.floor(stageDuration);
    } else {
        // 막스테이지 아니면 반올림 처리 -> 9.6초라면 10초로 올려준다
      stageDuration = Math.round(stageDuration);
    }
    
    // 각 스테이지의 초당 점수 곱하여 반영 
    totalScore += stageDuration * scorePerSecond;
  });

  
    // 아이템 획득 시 점수 추가
    userItems.forEach((userItem) => {
        const item = itemData.data.find((item) => item.id === userItem.id);
        if(item) {
            totalScore += item.score;
        }
    });
};
