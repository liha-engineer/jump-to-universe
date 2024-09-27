// 스테이지는 하나씩 이동한다
// 일정 점수가 되면 다음 스테이지로 이동한다 
import { setStage } from "../models/stage.model.js";
import { getGameAssets } from "../init/asset.js";

export const moveStageHandler = (userId, payload) => {

    // 클라이언트가 currnetStage, nextStage 정보 전해줄 것 - 검증 필요
    let currentStages = getStage(userId);
    if(!currentStages.length) {
        return {status : 'fail', message : 'No stages found for this user'}
    }

    // 유저가 지나간 스테이지는 여러개일 수 있어서, currnetStages 오름차순 정렬하고 가장 끝 스테이지를 가져온다
    currentStages.sort((a, b) => a.id - b.id);
    const currentStage = currentStages[currentStages.length - 1];

    // 클라이언트에서 보내주는 스테이지 정보가 서버에서 구한 값과 같은지 검증 - 여기서 쓰려고 payload 받는 것
    if(currentStage.id !== payload.currentStage) {
        return { status : 'fail', message : 'Current stage does not match'}
    }
    
    // 점수 검증
    const serverTime = Date.now(); // 현재 타임스탬프
    const elapsedTime = (serverTime - currentStage.timestamp) / 1000;

        // 1스테이지 -> 2스테이지 넘어간다 치면 점수가 100점이어야 한다 (1스테이지는 1초에 1점)
        if (elapsedTime < 100 || elapsedTime > 105) {
            return { status : 'fail', message : 'Invalid elapsed time'}
        }

    // 넘어갈 targetStage가 유효한지 검증
    const { stages } = getGameAssets();
    if(!stages.data.some((stage) => stage.id === payload.targetStage)) {
        return { status : 'fail', message : 'Target stage does not match'}
    }

    setStage(userId, payload.targetStage, serverTime);

  return { status: 'success' };
};
