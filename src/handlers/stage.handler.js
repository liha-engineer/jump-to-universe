// 스테이지는 하나씩 이동한다
// 일정 점수가 되면 다음 스테이지로 이동한다
import { getStage, setStage } from '../models/stage.model.js';
import { getuserItems } from '../models/item.model.js';
import { getGameAssets } from '../init/asset.js';
import { calculateTotalScore } from '../utils/calculateTotalScore.js';

export const moveStageHandler = (userId, payload) => {

  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for this user' };
  }

  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages.at(-1);

  // 클라이언트에서 보내주는 스테이지 정보가 서버에서 구한 값과 같은지 검증 - 여기서 쓰려고 payload 받는 것
  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current stage does not match' };
  }

  const { stages } = getGameAssets();
  if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage does not match' };
  }

  const targetStageInfo = stages.data.find((stage) => stage.id === payload.targetStage);
  if (!targetStageInfo) {
    return { status: 'fail', message: 'Target stage not found' };
  }

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
