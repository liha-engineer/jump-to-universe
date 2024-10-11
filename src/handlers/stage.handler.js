// 스테이지는 하나씩 이동한다
// 일정 점수가 되면 다음 스테이지로 이동한다
import { getStage, setStage } from '../models/stage.model.js';
import { getuserItems } from '../models/item.model.js';
import { getGameAssets } from '../init/asset.js';
import { calculateTotalScore } from '../utils/calculateTotalScore.js';

export const moveStageHandler = (userId, payload) => {
  // 클라이언트가 currnetStage, 다음에 넘어갈 targetStage 정보 전해줄 것 - 검증 필요

  // 우선 유저의 현재 스테이지 정보 불러오고, 최대 스테이지 ID 찾는다
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for this user' };
  }

  // 유저가 지나간 스테이지는 여러개일 수 있어서, currnetStages 오름차순 정렬하고 가장 끝 스테이지를 가져온다 (이게 현재 스테이지일 것)
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 클라이언트에서 보내주는 스테이지 정보가 서버에서 구한 값과 같은지 검증 - 여기서 쓰려고 payload 받는 것
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current stage does not match' };
  }

  // 넘어갈 targetStage가 유효한지 검증
  const { stages } = getGameAssets();
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage does not match' };
  }

  // 유저의 현재 점수와 DB에 저장된 점수를 비교해서, 유저의 점수가 더 높으면 다음 스테이지로 올려준다 -> 이건 과제로

  const targetStageInfo = stages.data.find((stage) => stage.id === payload.targetStage);
  if (!targetStageInfo) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  // 점수 검증
  const serverTime = Date.now(); // 현재 타임스탬프를 구함
  const userItems = getuserItems(userId);
  const totalScore = calculateTotalScore(currentStages, serverTime, true, userItems);

  if (targetStageInfo.score > totalScore) {
    return { status: 'fail', message: 'Invalid elapsed Time!' };
  }

  // 유저의 다음 스테이지 정보 업데이트 + 현재 시간
  setStage(userId, payload.targetStage, serverTime);
  return { status: 'success', hanlder: 11 };
};
